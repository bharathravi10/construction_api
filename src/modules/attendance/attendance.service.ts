import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attendance, AttendanceDocument } from '../../common/schemas/attendance.schema';
import { User, UserDocument } from '../../common/schemas/user.schema';
import { CreateAttendanceDto, UpdateAttendanceDto } from './attendance.dto';

@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);

  constructor(
    @InjectModel(Attendance.name) private readonly attendanceModel: Model<AttendanceDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Wrapper for error handling - eliminates code duplication
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
        throw error; // Re-throw known exceptions
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
   * Validate attendance data based on status
   */
  private validateAttendanceData(attendanceData: CreateAttendanceDto | UpdateAttendanceDto): void {
    const status = attendanceData.status;
    
    if (status === 'present' || status === 'halfday') {
      // For present and halfday, checkIn should be provided
      if (!attendanceData.checkIn) {
        throw new BadRequestException(
          `Check-in time is required for ${status} status`
        );
      }
    }

    // If checkOut is provided, checkIn must also be provided
    if (attendanceData.checkOut && !attendanceData.checkIn) {
      throw new BadRequestException('Check-in time is required when check-out time is provided');
    }

    // Validate that checkOut is after checkIn
    if (attendanceData.checkIn && attendanceData.checkOut) {
      const checkInTime = new Date(attendanceData.checkIn);
      const checkOutTime = new Date(attendanceData.checkOut);
      
      if (checkOutTime <= checkInTime) {
        throw new BadRequestException('Check-out time must be after check-in time');
      }
    }
  }

  /**
   * Find and validate attendance exists
   */
  private async findAttendanceById(id: string): Promise<AttendanceDocument> {
    const attendance = await this.attendanceModel
      .findOne({ _id: id, is_deleted: false })
      .exec();

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    return attendance;
  }

  /**
   * Populate attendance with user details
   */
  private async populateAttendanceDetails(attendance: AttendanceDocument): Promise<any> {
    const attendanceObj = attendance.toObject();

    // Populate user
    if (attendance.user) {
      const user = await this.userModel
        .findOne({ _id: attendance.user, is_deleted: false })
        .select('_id name email mobile')
        .exec();
      if (user) {
        attendanceObj.user = user;
      }
    }

    return attendanceObj;
  }

  /**
   * Populate multiple attendances with details - optimized with batch queries
   */
  private async populateAttendancesDetails(attendances: AttendanceDocument[]): Promise<any[]> {
    if (attendances.length === 0) return [];

    // Collect all unique user IDs for batch queries
    const userIds = new Set<string>();

    attendances.forEach(attendance => {
      if (attendance.user) {
        userIds.add(attendance.user.toString());
      }
    });

    // Batch fetch users
    const users = userIds.size > 0
      ? await this.userModel
          .find({ _id: { $in: Array.from(userIds) }, is_deleted: false })
          .select('_id name email mobile')
          .exec()
      : [];

    // Create lookup map for O(1) access
    const userMap = new Map(users.map(u => [u._id.toString(), u]));

    // Populate attendances using map
    return attendances.map(attendance => {
      const attendanceObj = attendance.toObject();
      
      if (attendance.user) {
        const user = userMap.get(attendance.user.toString());
        if (user) {
          attendanceObj.user = user;
        }
      }

      return attendanceObj;
    });
  }

  /**
   * Prepare attendance data with ObjectId conversions
   */
  private prepareAttendanceData(attendanceData: any): any {
    const prepared: any = { ...attendanceData };

    if (prepared.user) {
      prepared.user = new Types.ObjectId(prepared.user);
    }

    // Normalize date to start of day for consistency
    if (prepared.date) {
      const date = new Date(prepared.date);
      date.setHours(0, 0, 0, 0);
      prepared.date = date;
    }

    return prepared;
  }

  async create(createAttendanceDto: CreateAttendanceDto): Promise<{ message: string }> {
    return this.handleError(async () => {
      // Validate user
      await this.validateUser(createAttendanceDto.user);

      // Validate attendance data
      this.validateAttendanceData(createAttendanceDto);

      // Prepare and save attendance
      const attendanceData = this.prepareAttendanceData(createAttendanceDto);
      
      // Check if attendance already exists for this user and date
      const existingAttendance = await this.attendanceModel.findOne({
        user: attendanceData.user,
        date: attendanceData.date,
        is_deleted: false
      }).exec();

      if (existingAttendance) {
        throw new BadRequestException(
          'Attendance record already exists for this user on this date'
        );
      }

      const createdAttendance = new this.attendanceModel(attendanceData);
      await createdAttendance.save();
      
      this.logger.log(`Attendance created: ${createdAttendance._id}`);
      return { message: 'Attendance created successfully' };
    }, 'create attendance');
  }

  async findAll(filters?: { 
    userId?: string; 
    status?: string; 
    startDate?: string; 
    endDate?: string;
    date?: string;
  }): Promise<any[]> {
    return this.handleError(async () => {
      const query: any = { is_deleted: false };

      if (filters?.userId) {
        query.user = new Types.ObjectId(filters.userId);
      }

      if (filters?.status) {
        query.status = filters.status;
      }

      if (filters?.date) {
        // Single date filter
        const date = new Date(filters.date);
        date.setHours(0, 0, 0, 0);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        query.date = { $gte: date, $lt: nextDay };
      } else if (filters?.startDate || filters?.endDate) {
        // Date range filter
        if (filters.startDate && filters.endDate) {
          const startDate = new Date(filters.startDate);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(filters.endDate);
          endDate.setHours(23, 59, 59, 999);
          query.date = { $gte: startDate, $lte: endDate };
        } else if (filters.startDate) {
          const startDate = new Date(filters.startDate);
          startDate.setHours(0, 0, 0, 0);
          query.date = { $gte: startDate };
        } else if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          endDate.setHours(23, 59, 59, 999);
          query.date = { $lte: endDate };
        }
      }

      const attendances = await this.attendanceModel
        .find(query)
        .select('-createdAt -updatedAt -__v -is_deleted')
        .sort({ date: -1, createdAt: -1 })
        .exec();

      return this.populateAttendancesDetails(attendances);
    }, 'fetch attendances');
  }

  async findOne(id: string): Promise<any> {
    return this.handleError(async () => {
      const attendance = await this.attendanceModel
        .findOne({ _id: id, is_deleted: false })
        .select('-createdAt -updatedAt -__v -is_deleted')
        .exec();

      if (!attendance) {
        throw new NotFoundException('Attendance record not found');
      }

      return this.populateAttendanceDetails(attendance);
    }, 'fetch attendance', id);
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<Partial<Attendance>> {
    return this.handleError(async () => {
      // Get existing attendance first
      const existingAttendance = await this.findAttendanceById(id);

      // Merge existing data with update data for validation
      const mergedData = {
        ...existingAttendance.toObject(),
        ...updateAttendanceDto
      };

      // Validate attendance data
      this.validateAttendanceData(mergedData);

      // Prepare update data
      const updateData: any = { ...updateAttendanceDto };

      // Normalize date if being updated (though date updates are rare)
      if (updateData.date) {
        const date = new Date(updateData.date);
        date.setHours(0, 0, 0, 0);
        updateData.date = date;
      }

      const attendance = await this.attendanceModel
        .findOneAndUpdate(
          { _id: id, is_deleted: false },
          { $set: updateData },
          { new: true }
        )
        .select('-createdAt -updatedAt -__v -is_deleted')
        .exec();

      if (!attendance) {
        throw new NotFoundException('Attendance record not found or deleted');
      }

      this.logger.log(`Attendance updated: ${id}`);
      return attendance.toObject();
    }, 'update attendance', id);
  }

  async softDelete(id: string): Promise<{ message: string }> {
    return this.handleError(async () => {
      const attendance = await this.attendanceModel.findOneAndUpdate(
        { _id: id, is_deleted: false },
        { $set: { is_deleted: true } },
        { new: true }
      ).exec();

      if (!attendance) {
        throw new NotFoundException('Attendance record not found');
      }

      this.logger.log(`Attendance soft-deleted: ${id}`);
      return { message: 'Attendance deleted successfully' };
    }, 'delete attendance', id);
  }

  /**
   * Delete attendance - soft delete only (sets is_deleted: true)
   */
  async delete(id: string): Promise<{ message: string }> {
    return this.softDelete(id);
  }

  /**
   * Get attendance by user and date
   */
  async getAttendanceByUserAndDate(userId: string, date: string): Promise<any> {
    return this.handleError(async () => {
      await this.validateUser(userId);

      const attendanceDate = new Date(date);
      attendanceDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(attendanceDate);
      nextDay.setDate(nextDay.getDate() + 1);

      const attendance = await this.attendanceModel
        .findOne({
          user: new Types.ObjectId(userId),
          date: { $gte: attendanceDate, $lt: nextDay },
          is_deleted: false
        })
        .select('-createdAt -updatedAt -__v -is_deleted')
        .exec();

      if (!attendance) {
        throw new NotFoundException('Attendance record not found for this user and date');
      }

      return this.populateAttendanceDetails(attendance);
    }, 'fetch attendance by user and date', `${userId}-${date}`);
  }

  /**
   * Get all attendances for a specific user
   */
  async getAttendancesByUser(userId: string, filters?: { 
    status?: string; 
    startDate?: string; 
    endDate?: string;
  }): Promise<any[]> {
    return this.handleError(async () => {
      await this.validateUser(userId);

      const query: any = { 
        user: new Types.ObjectId(userId),
        is_deleted: false 
      };

      if (filters?.status) {
        query.status = filters.status;
      }

      if (filters?.startDate || filters?.endDate) {
        if (filters.startDate && filters.endDate) {
          const startDate = new Date(filters.startDate);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(filters.endDate);
          endDate.setHours(23, 59, 59, 999);
          query.date = { $gte: startDate, $lte: endDate };
        } else if (filters.startDate) {
          const startDate = new Date(filters.startDate);
          startDate.setHours(0, 0, 0, 0);
          query.date = { $gte: startDate };
        } else if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          endDate.setHours(23, 59, 59, 999);
          query.date = { $lte: endDate };
        }
      }

      const attendances = await this.attendanceModel
        .find(query)
        .select('-createdAt -updatedAt -__v -is_deleted')
        .sort({ date: -1 })
        .exec();

      return this.populateAttendancesDetails(attendances);
    }, 'fetch attendances for user', userId);
  }
}

