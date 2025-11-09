import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SalaryRate, SalaryRateDocument } from '../../common/schemas/salary-rate.schema';
import { SalaryCalculation, SalaryCalculationDocument } from '../../common/schemas/salary-calculation.schema';
import { Attendance, AttendanceDocument } from '../../common/schemas/attendance.schema';
import { User, UserDocument } from '../../common/schemas/user.schema';
import { CreateSalaryRateDto, UpdateSalaryRateDto, CalculateSalaryDto, GetSalaryCalculationDto } from './salary.dto';

@Injectable()
export class SalaryService {
  private readonly logger = new Logger(SalaryService.name);

  constructor(
    @InjectModel(SalaryRate.name) private readonly salaryRateModel: Model<SalaryRateDocument>,
    @InjectModel(SalaryCalculation.name) private readonly salaryCalculationModel: Model<SalaryCalculationDocument>,
    @InjectModel(Attendance.name) private readonly attendanceModel: Model<AttendanceDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Wrapper for error handling
   */
  private async handleError<T>(
    operation: () => Promise<T>,
    errorMessage: string,
    context?: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      const contextStr = context ? ` ${context}` : '';
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Error) {
        this.logger.error(`Failed to ${errorMessage}${contextStr}`, error.stack);
        throw error;
      } else {
        this.logger.error(`Unknown error ${errorMessage}${contextStr}`, JSON.stringify(error));
        throw new Error(`Failed to ${errorMessage}`);
      }
    }
  }

  /**
   * Validate user exists
   */
  private async validateUser(userId: string | Types.ObjectId): Promise<void> {
    const user = await this.userModel.findOne({ 
      _id: userId, 
      is_deleted: false 
    }).exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  /**
   * Get active salary rate for user and project (or base rate if project is null)
   */
  private async getActiveSalaryRate(userId: Types.ObjectId, projectId?: Types.ObjectId, date?: Date): Promise<SalaryRateDocument | null> {
    const queryDate = date || new Date();
    
    const query: any = {
      user: userId,
      isActive: true,
      is_deleted: false,
      effectiveFrom: { $lte: queryDate },
      $or: [
        { effectiveTo: null },
        { effectiveTo: { $gte: queryDate } }
      ]
    };

    // If project is specified, get project-specific rate, otherwise get base rate (project is null)
    if (projectId) {
      query.project = projectId;
    } else {
      query.project = null;
    }

    const rate = await this.salaryRateModel
      .findOne(query)
      .sort({ effectiveFrom: -1 }) // Get the most recent rate
      .exec();

    return rate;
  }

  /**
   * Calculate working hours from check-in and check-out times
   */
  private calculateWorkingHours(checkIn?: Date, checkOut?: Date): number {
    if (!checkIn || !checkOut) {
      return 0;
    }
    const checkInTime = new Date(checkIn);
    const checkOutTime = new Date(checkOut);
    const diffMs = checkOutTime.getTime() - checkInTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return Math.max(0, diffHours);
  }

  /**
   * Calculate salary based on attendance records
   */
  async calculateSalary(calculateSalaryDto: CalculateSalaryDto): Promise<SalaryCalculationDocument> {
    return this.handleError(async () => {
      // Validate user
      await this.validateUser(calculateSalaryDto.user);

      const userId = new Types.ObjectId(calculateSalaryDto.user);
      const projectId = calculateSalaryDto.project ? new Types.ObjectId(calculateSalaryDto.project) : undefined;
      const periodStart = new Date(calculateSalaryDto.periodStart);
      const periodEnd = new Date(calculateSalaryDto.periodEnd);

      // Validate date range
      if (periodStart > periodEnd) {
        throw new BadRequestException('Period start date cannot be after end date');
      }

      // Check if calculation already exists
      const existingCalculation = await this.salaryCalculationModel.findOne({
        user: userId,
        project: projectId || null,
        periodType: calculateSalaryDto.periodType,
        periodStart: periodStart,
        periodEnd: periodEnd,
        is_deleted: false
      }).exec();

      if (existingCalculation && !calculateSalaryDto.forceRecalculate) {
        throw new BadRequestException(
          'Salary calculation already exists for this period. Use forceRecalculate=true to recalculate.'
        );
      }

      // Get active salary rate for the period
      const salaryRate = await this.getActiveSalaryRate(userId, projectId, periodStart);
      
      if (!salaryRate) {
        throw new NotFoundException(
          `No active salary rate found for user${projectId ? ' and project' : ''}. Please create a salary rate first.`
        );
      }

      // Get attendance records for the period
      const attendances = await this.attendanceModel.find({
        user: userId,
        date: { $gte: periodStart, $lte: periodEnd },
        is_deleted: false
      }).sort({ date: 1 }).exec();

      // Calculate attendance summary
      let presentDays = 0;
      let halfDays = 0;
      let absentDays = 0;
      let totalOvertimeHours = 0;
      let totalWorkingHours = 0; // For hour-based calculation (regular hours only, excluding overtime)
      let halfDayHours = 0; // For hour-based calculation

      attendances.forEach(attendance => {
        if (attendance.status === 'present') {
          presentDays++;
          // Calculate working hours from check-in/check-out
          if (attendance.checkIn && attendance.checkOut) {
            const hours = this.calculateWorkingHours(attendance.checkIn, attendance.checkOut);
            totalWorkingHours += hours;
          }
        } else if (attendance.status === 'halfday') {
          halfDays++;
          // Calculate working hours for half day
          if (attendance.checkIn && attendance.checkOut) {
            const hours = this.calculateWorkingHours(attendance.checkIn, attendance.checkOut);
            halfDayHours += hours;
            totalWorkingHours += hours;
          }
        } else if (attendance.status === 'absent') {
          absentDays++;
        }

        // Calculate overtime in hours (overtime is stored in minutes)
        if (attendance.overtime > 0) {
          const overtimeHours = attendance.overtime / 60;
          totalOvertimeHours += overtimeHours;
        }
      });

      // For hour-based calculation, subtract overtime from regular working hours
      // Overtime is paid separately at overtime rate
      const regularWorkingHours = Math.max(0, totalWorkingHours - totalOvertimeHours);

      const totalDays = presentDays + halfDays + absentDays;
      const calculationType = salaryRate.calculationType;
      const overtimeRatePerHour = salaryRate.overtimeRatePerHour || 0;

      let baseSalary = 0;
      let halfDaySalary = 0;
      let overtimeSalary = 0;
      let totalSalary = 0;
      let dailyRate = 0;
      let hourlyRate = 0;
      let projectRate = 0;

      // Calculate salary based on calculation type
      if (calculationType === 'day') {
        // Day-based calculation
        dailyRate = salaryRate.dailyRate || 0;
        baseSalary = presentDays * dailyRate;
        halfDaySalary = halfDays * (dailyRate / 2);
        overtimeSalary = totalOvertimeHours * overtimeRatePerHour;
        totalSalary = baseSalary + halfDaySalary + overtimeSalary;
      } else if (calculationType === 'hour') {
        // Hour-based calculation
        hourlyRate = salaryRate.hourlyRate || 0;
        
        // Calculate base salary from regular working hours (excluding overtime)
        // Overtime is calculated separately at overtime rate
        baseSalary = regularWorkingHours * hourlyRate;
        halfDaySalary = 0; // For hour-based, all hours are paid at the same rate
        
        // Overtime is paid at overtime rate (if different from regular rate)
        overtimeSalary = totalOvertimeHours * overtimeRatePerHour;
        totalSalary = baseSalary + overtimeSalary;
      } else if (calculationType === 'project') {
        // Project-based calculation - fixed salary for the project
        projectRate = salaryRate.projectRate || 0;
        baseSalary = projectRate; // Fixed project rate
        halfDaySalary = 0; // Not applicable for project-based
        overtimeSalary = 0; // Overtime not applicable for project-based
        totalSalary = projectRate; // Total salary is the project rate
      }

      // Create or update salary calculation
      const calculationData: any = {
        user: userId,
        project: projectId || null,
        periodType: calculateSalaryDto.periodType,
        periodStart: periodStart,
        periodEnd: periodEnd,
        calculationType,
        totalDays,
        presentDays,
        halfDays,
        absentDays,
        totalOvertimeHours: Math.round(totalOvertimeHours * 100) / 100,
        totalWorkingHours: Math.round(totalWorkingHours * 100) / 100,
        baseSalary: Math.round(baseSalary * 100) / 100,
        halfDaySalary: Math.round(halfDaySalary * 100) / 100,
        overtimeSalary: Math.round(overtimeSalary * 100) / 100,
        totalSalary: Math.round(totalSalary * 100) / 100,
        dailyRate: calculationType === 'day' ? dailyRate : 0,
        hourlyRate: calculationType === 'hour' ? hourlyRate : 0,
        projectRate: calculationType === 'project' ? projectRate : 0,
        overtimeRatePerHour: calculationType === 'project' ? 0 : overtimeRatePerHour,
        status: 'calculated'
      };

      let calculation: SalaryCalculationDocument;

      if (existingCalculation && calculateSalaryDto.forceRecalculate) {
        // Update existing calculation
        calculation = await this.salaryCalculationModel.findOneAndUpdate(
          { _id: existingCalculation._id },
          { $set: calculationData },
          { new: true }
        ).exec();
      } else {
        // Create new calculation
        calculation = new this.salaryCalculationModel(calculationData);
        await calculation.save();
      }

      this.logger.log(`Salary calculated for user ${userId} for period ${periodStart} to ${periodEnd}`);
      return calculation;
    }, 'calculate salary');
  }

  /**
   * Validate salary rate data based on calculation type
   */
  private validateSalaryRateData(
    calculationType: string, 
    dailyRate?: number, 
    hourlyRate?: number, 
    projectRate?: number,
    overtimeRatePerHour?: number
  ): void {
    if (calculationType === 'day') {
      if (!dailyRate || dailyRate <= 0) {
        throw new BadRequestException('Daily rate is required and must be greater than 0 when calculationType is "day"');
      }
      if (hourlyRate && hourlyRate > 0) {
        throw new BadRequestException('Cannot set hourly rate when calculationType is "day". Only daily rate is allowed.');
      }
      if (projectRate && projectRate > 0) {
        throw new BadRequestException('Cannot set project rate when calculationType is "day". Only daily rate is allowed.');
      }
    } else if (calculationType === 'hour') {
      if (!hourlyRate || hourlyRate <= 0) {
        throw new BadRequestException('Hourly rate is required and must be greater than 0 when calculationType is "hour"');
      }
      if (dailyRate && dailyRate > 0) {
        throw new BadRequestException('Cannot set daily rate when calculationType is "hour". Only hourly rate is allowed.');
      }
      if (projectRate && projectRate > 0) {
        throw new BadRequestException('Cannot set project rate when calculationType is "hour". Only hourly rate is allowed.');
      }
    } else if (calculationType === 'project') {
      if (!projectRate || projectRate <= 0) {
        throw new BadRequestException('Project rate is required and must be greater than 0 when calculationType is "project"');
      }
      if (dailyRate && dailyRate > 0) {
        throw new BadRequestException('Cannot set daily rate when calculationType is "project". Only project rate is allowed.');
      }
      if (hourlyRate && hourlyRate > 0) {
        throw new BadRequestException('Cannot set hourly rate when calculationType is "project". Only project rate is allowed.');
      }
      if (overtimeRatePerHour && overtimeRatePerHour > 0) {
        throw new BadRequestException('Cannot set overtime rate when calculationType is "project". Overtime rate is not needed for project-based salary.');
      }
    }
  }

  /**
   * Validate project is required for project-based salary
   */
  private validateProjectBasedSalary(calculationType: string, project?: Types.ObjectId): void {
    if (calculationType === 'project' && !project) {
      throw new BadRequestException('Project is required when calculationType is "project". User must be assigned to a project.');
    }
  }

  /**
   * Create salary rate
   */
  async createSalaryRate(createSalaryRateDto: CreateSalaryRateDto): Promise<{ message: string }> {
    return this.handleError(async () => {
      await this.validateUser(createSalaryRateDto.user);

      // Validate calculation type and rates
      this.validateSalaryRateData(
        createSalaryRateDto.calculationType,
        createSalaryRateDto.dailyRate,
        createSalaryRateDto.hourlyRate,
        createSalaryRateDto.projectRate,
        createSalaryRateDto.overtimeRatePerHour
      );

      // Validate project is required for project-based salary
      this.validateProjectBasedSalary(
        createSalaryRateDto.calculationType,
        createSalaryRateDto.project ? new Types.ObjectId(createSalaryRateDto.project) : undefined
      );

      // If project is provided, validate it exists
      if (createSalaryRateDto.project) {
        // You might want to validate project exists here
        // For now, we'll just create the rate
      }

      const effectiveFrom = createSalaryRateDto.effectiveFrom 
        ? new Date(createSalaryRateDto.effectiveFrom)
        : new Date();

      // Deactivate any existing active rates for the same user-project combination
      if (createSalaryRateDto.project) {
        await this.salaryRateModel.updateMany(
          {
            user: createSalaryRateDto.user,
            project: createSalaryRateDto.project,
            isActive: true,
            is_deleted: false
          },
          {
            $set: {
              isActive: false,
              effectiveTo: new Date(effectiveFrom.getTime() - 1) // Set to day before new rate
            }
          }
        ).exec();
      } else {
        // For base salary (no project), deactivate all base rates
        await this.salaryRateModel.updateMany(
          {
            user: createSalaryRateDto.user,
            project: null,
            isActive: true,
            is_deleted: false
          },
          {
            $set: {
              isActive: false,
              effectiveTo: new Date(effectiveFrom.getTime() - 1)
            }
          }
        ).exec();
      }

      const salaryRateData: any = {
        ...createSalaryRateDto,
        user: new Types.ObjectId(createSalaryRateDto.user),
        project: createSalaryRateDto.project ? new Types.ObjectId(createSalaryRateDto.project) : null,
        effectiveFrom,
        effectiveTo: createSalaryRateDto.effectiveTo ? new Date(createSalaryRateDto.effectiveTo) : null,
        overtimeRatePerHour: createSalaryRateDto.overtimeRatePerHour || 0
      };

      // Set only the relevant rate based on calculation type
      if (createSalaryRateDto.calculationType === 'day') {
        salaryRateData.dailyRate = createSalaryRateDto.dailyRate;
        salaryRateData.hourlyRate = undefined;
        salaryRateData.projectRate = undefined;
        salaryRateData.overtimeRatePerHour = createSalaryRateDto.overtimeRatePerHour || 0;
      } else if (createSalaryRateDto.calculationType === 'hour') {
        salaryRateData.hourlyRate = createSalaryRateDto.hourlyRate;
        salaryRateData.dailyRate = undefined;
        salaryRateData.projectRate = undefined;
        salaryRateData.overtimeRatePerHour = createSalaryRateDto.overtimeRatePerHour || 0;
      } else if (createSalaryRateDto.calculationType === 'project') {
        salaryRateData.projectRate = createSalaryRateDto.projectRate;
        salaryRateData.dailyRate = undefined;
        salaryRateData.hourlyRate = undefined;
        salaryRateData.overtimeRatePerHour = 0; // Not needed for project-based
      }

      const salaryRate = new this.salaryRateModel(salaryRateData);

      await salaryRate.save();
      
      this.logger.log(`Salary rate created: ${salaryRate._id}`);
      return { message: 'Salary rate created successfully' };
    }, 'create salary rate');
  }

  /**
   * Get all salary rates
   */
  async getSalaryRates(filters?: { userId?: string; projectId?: string; isActive?: boolean }): Promise<any[]> {
    return this.handleError(async () => {
      const query: any = { is_deleted: false };

      if (filters?.userId) {
        query.user = new Types.ObjectId(filters.userId);
      }

      if (filters?.projectId) {
        query.project = filters.projectId === 'null' ? null : new Types.ObjectId(filters.projectId);
      }

      if (filters?.isActive !== undefined) {
        query.isActive = filters.isActive;
      }

      const rates = await this.salaryRateModel
        .find(query)
        .populate('user', 'name email mobile')
        .populate('project', 'name')
        .sort({ effectiveFrom: -1 })
        .exec();

      return rates;
    }, 'fetch salary rates');
  }

  /**
   * Get salary rate by ID
   */
  async getSalaryRateById(id: string): Promise<any> {
    return this.handleError(async () => {
      const rate = await this.salaryRateModel
        .findOne({ _id: id, is_deleted: false })
        .populate('user', 'name email mobile')
        .populate('project', 'name')
        .exec();

      if (!rate) {
        throw new NotFoundException('Salary rate not found');
      }

      return rate;
    }, 'fetch salary rate', id);
  }

  /**
   * Update salary rate
   */
  async updateSalaryRate(id: string, updateSalaryRateDto: UpdateSalaryRateDto): Promise<Partial<SalaryRate>> {
    return this.handleError(async () => {
      const rate = await this.salaryRateModel.findOne({ _id: id, is_deleted: false }).exec();

      if (!rate) {
        throw new NotFoundException('Salary rate not found');
      }

      // Determine calculation type (use existing if not provided in update)
      const calculationType = updateSalaryRateDto.calculationType || rate.calculationType;
      
      // Validate rates based on calculation type
      const dailyRate = updateSalaryRateDto.dailyRate !== undefined ? updateSalaryRateDto.dailyRate : rate.dailyRate;
      const hourlyRate = updateSalaryRateDto.hourlyRate !== undefined ? updateSalaryRateDto.hourlyRate : rate.hourlyRate;
      const projectRate = updateSalaryRateDto.projectRate !== undefined ? updateSalaryRateDto.projectRate : rate.projectRate;
      const overtimeRatePerHour = updateSalaryRateDto.overtimeRatePerHour !== undefined ? updateSalaryRateDto.overtimeRatePerHour : rate.overtimeRatePerHour;
      
      this.validateSalaryRateData(calculationType, dailyRate, hourlyRate, projectRate, overtimeRatePerHour);

      const updateData: any = { ...updateSalaryRateDto };

      if (updateData.project !== undefined) {
        updateData.project = updateData.project ? new Types.ObjectId(updateData.project) : null;
      }

      if (updateData.effectiveFrom) {
        updateData.effectiveFrom = new Date(updateData.effectiveFrom);
      }

      if (updateData.effectiveTo) {
        updateData.effectiveTo = new Date(updateData.effectiveTo);
      }

      // Set only the relevant rate based on calculation type
      const finalCalculationType = updateData.calculationType || rate.calculationType;
      
      if (finalCalculationType === 'day') {
        if (updateData.dailyRate !== undefined) {
          updateData.dailyRate = updateData.dailyRate;
        }
        updateData.hourlyRate = undefined;
        updateData.projectRate = undefined;
        updateData.overtimeRatePerHour = updateData.overtimeRatePerHour !== undefined ? updateData.overtimeRatePerHour : rate.overtimeRatePerHour;
      } else if (finalCalculationType === 'hour') {
        if (updateData.hourlyRate !== undefined) {
          updateData.hourlyRate = updateData.hourlyRate;
        }
        updateData.dailyRate = undefined;
        updateData.projectRate = undefined;
        updateData.overtimeRatePerHour = updateData.overtimeRatePerHour !== undefined ? updateData.overtimeRatePerHour : rate.overtimeRatePerHour;
      } else if (finalCalculationType === 'project') {
        if (updateData.projectRate !== undefined) {
          updateData.projectRate = updateData.projectRate;
        }
        updateData.dailyRate = undefined;
        updateData.hourlyRate = undefined;
        updateData.overtimeRatePerHour = 0; // Not needed for project-based
      }

      const updatedRate = await this.salaryRateModel.findOneAndUpdate(
        { _id: id, is_deleted: false },
        { $set: updateData },
        { new: true }
      ).exec();

      if (!updatedRate) {
        throw new NotFoundException('Salary rate not found or deleted');
      }

      this.logger.log(`Salary rate updated: ${id}`);
      return updatedRate.toObject();
    }, 'update salary rate', id);
  }

  /**
   * Delete salary rate (soft delete)
   */
  async deleteSalaryRate(id: string): Promise<{ message: string }> {
    return this.handleError(async () => {
      const rate = await this.salaryRateModel.findOneAndUpdate(
        { _id: id, is_deleted: false },
        { $set: { is_deleted: true, isActive: false } },
        { new: true }
      ).exec();

      if (!rate) {
        throw new NotFoundException('Salary rate not found');
      }

      this.logger.log(`Salary rate soft-deleted: ${id}`);
      return { message: 'Salary rate deleted successfully' };
    }, 'delete salary rate', id);
  }

  /**
   * Get salary calculations
   */
  async getSalaryCalculations(filters?: GetSalaryCalculationDto): Promise<any[]> {
    return this.handleError(async () => {
      const query: any = { is_deleted: false };

      if (filters?.userId) {
        query.user = new Types.ObjectId(filters.userId);
      }

      if (filters?.projectId) {
        query.project = filters.projectId === 'null' ? null : new Types.ObjectId(filters.projectId);
      }

      if (filters?.periodType) {
        query.periodType = filters.periodType;
      }

      if (filters?.startDate || filters?.endDate) {
        if (filters.startDate && filters.endDate) {
          query.periodStart = { $gte: new Date(filters.startDate), $lte: new Date(filters.endDate) };
        } else if (filters.startDate) {
          query.periodStart = { $gte: new Date(filters.startDate) };
        } else if (filters.endDate) {
          query.periodEnd = { $lte: new Date(filters.endDate) };
        }
      }

      if (filters?.status) {
        query.status = filters.status;
      }

      const calculations = await this.salaryCalculationModel
        .find(query)
        .populate('user', 'name email mobile')
        .populate('project', 'name')
        .sort({ periodStart: -1 })
        .exec();

      return calculations;
    }, 'fetch salary calculations');
  }

  /**
   * Get salary calculation by ID
   */
  async getSalaryCalculationById(id: string): Promise<any> {
    return this.handleError(async () => {
      const calculation = await this.salaryCalculationModel
        .findOne({ _id: id, is_deleted: false })
        .populate('user', 'name email mobile')
        .populate('project', 'name')
        .exec();

      if (!calculation) {
        throw new NotFoundException('Salary calculation not found');
      }

      return calculation;
    }, 'fetch salary calculation', id);
  }

  /**
   * Update salary calculation status (approve, mark as paid, etc.)
   */
  async updateSalaryCalculationStatus(id: string, status: string): Promise<Partial<SalaryCalculation>> {
    return this.handleError(async () => {
      const validStatuses = ['pending', 'calculated', 'approved', 'paid'];
      if (!validStatuses.includes(status)) {
        throw new BadRequestException(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      const updateData: any = { status };

      if (status === 'approved') {
        updateData.approvedAt = new Date();
      } else if (status === 'paid') {
        updateData.paidAt = new Date();
      }

      const calculation = await this.salaryCalculationModel.findOneAndUpdate(
        { _id: id, is_deleted: false },
        { $set: updateData },
        { new: true }
      ).exec();

      if (!calculation) {
        throw new NotFoundException('Salary calculation not found');
      }

      this.logger.log(`Salary calculation status updated: ${id} to ${status}`);
      return calculation.toObject();
    }, 'update salary calculation status', id);
  }

  /**
   * Delete salary calculation (soft delete)
   */
  async deleteSalaryCalculation(id: string): Promise<{ message: string }> {
    return this.handleError(async () => {
      const calculation = await this.salaryCalculationModel.findOneAndUpdate(
        { _id: id, is_deleted: false },
        { $set: { is_deleted: true } },
        { new: true }
      ).exec();

      if (!calculation) {
        throw new NotFoundException('Salary calculation not found');
      }

      this.logger.log(`Salary calculation soft-deleted: ${id}`);
      return { message: 'Salary calculation deleted successfully' };
    }, 'delete salary calculation', id);
  }
}

