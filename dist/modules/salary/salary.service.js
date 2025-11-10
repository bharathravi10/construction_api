"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SalaryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const salary_rate_schema_1 = require("../../common/schemas/salary-rate.schema");
const salary_calculation_schema_1 = require("../../common/schemas/salary-calculation.schema");
const attendance_schema_1 = require("../../common/schemas/attendance.schema");
const user_schema_1 = require("../../common/schemas/user.schema");
let SalaryService = SalaryService_1 = class SalaryService {
    constructor(salaryRateModel, salaryCalculationModel, attendanceModel, userModel) {
        this.salaryRateModel = salaryRateModel;
        this.salaryCalculationModel = salaryCalculationModel;
        this.attendanceModel = attendanceModel;
        this.userModel = userModel;
        this.logger = new common_1.Logger(SalaryService_1.name);
    }
    async handleError(operation, errorMessage, context) {
        try {
            return await operation();
        }
        catch (error) {
            const contextStr = context ? ` ${context}` : '';
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            if (error instanceof Error) {
                this.logger.error(`Failed to ${errorMessage}${contextStr}`, error.stack);
                throw error;
            }
            else {
                this.logger.error(`Unknown error ${errorMessage}${contextStr}`, JSON.stringify(error));
                throw new Error(`Failed to ${errorMessage}`);
            }
        }
    }
    async validateUser(userId) {
        const user = await this.userModel.findOne({
            _id: userId,
            is_deleted: false
        }).exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
    }
    async getActiveSalaryRate(userId, projectId, date) {
        const queryDate = date || new Date();
        const query = {
            user: userId,
            isActive: true,
            is_deleted: false,
            effectiveFrom: { $lte: queryDate },
            $or: [
                { effectiveTo: null },
                { effectiveTo: { $gte: queryDate } }
            ]
        };
        if (projectId) {
            query.project = projectId;
        }
        else {
            query.project = null;
        }
        const rate = await this.salaryRateModel
            .findOne(query)
            .sort({ effectiveFrom: -1 })
            .exec();
        return rate;
    }
    calculateWorkingHours(checkIn, checkOut) {
        if (!checkIn || !checkOut) {
            return 0;
        }
        const checkInTime = new Date(checkIn);
        const checkOutTime = new Date(checkOut);
        const diffMs = checkOutTime.getTime() - checkInTime.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        return Math.max(0, diffHours);
    }
    async calculateSalary(calculateSalaryDto) {
        return this.handleError(async () => {
            await this.validateUser(calculateSalaryDto.user);
            const userId = new mongoose_2.Types.ObjectId(calculateSalaryDto.user);
            const projectId = calculateSalaryDto.project ? new mongoose_2.Types.ObjectId(calculateSalaryDto.project) : undefined;
            const periodStart = new Date(calculateSalaryDto.periodStart);
            const periodEnd = new Date(calculateSalaryDto.periodEnd);
            if (periodStart > periodEnd) {
                throw new common_1.BadRequestException('Period start date cannot be after end date');
            }
            const existingCalculation = await this.salaryCalculationModel.findOne({
                user: userId,
                project: projectId || null,
                periodType: calculateSalaryDto.periodType,
                periodStart: periodStart,
                periodEnd: periodEnd,
                is_deleted: false
            }).exec();
            if (existingCalculation && !calculateSalaryDto.forceRecalculate) {
                throw new common_1.BadRequestException('Salary calculation already exists for this period. Use forceRecalculate=true to recalculate.');
            }
            const salaryRate = await this.getActiveSalaryRate(userId, projectId, periodStart);
            if (!salaryRate) {
                throw new common_1.NotFoundException(`No active salary rate found for user${projectId ? ' and project' : ''}. Please create a salary rate first.`);
            }
            const attendances = await this.attendanceModel.find({
                user: userId,
                date: { $gte: periodStart, $lte: periodEnd },
                is_deleted: false
            }).sort({ date: 1 }).exec();
            let presentDays = 0;
            let halfDays = 0;
            let absentDays = 0;
            let totalOvertimeHours = 0;
            let totalWorkingHours = 0;
            let halfDayHours = 0;
            attendances.forEach(attendance => {
                if (attendance.status === 'present') {
                    presentDays++;
                    if (attendance.checkIn && attendance.checkOut) {
                        const hours = this.calculateWorkingHours(attendance.checkIn, attendance.checkOut);
                        totalWorkingHours += hours;
                    }
                }
                else if (attendance.status === 'halfday') {
                    halfDays++;
                    if (attendance.checkIn && attendance.checkOut) {
                        const hours = this.calculateWorkingHours(attendance.checkIn, attendance.checkOut);
                        halfDayHours += hours;
                        totalWorkingHours += hours;
                    }
                }
                else if (attendance.status === 'absent') {
                    absentDays++;
                }
                if (attendance.overtime > 0) {
                    const overtimeHours = attendance.overtime / 60;
                    totalOvertimeHours += overtimeHours;
                }
            });
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
            if (calculationType === 'day') {
                dailyRate = salaryRate.dailyRate || 0;
                baseSalary = presentDays * dailyRate;
                halfDaySalary = halfDays * (dailyRate / 2);
                overtimeSalary = totalOvertimeHours * overtimeRatePerHour;
                totalSalary = baseSalary + halfDaySalary + overtimeSalary;
            }
            else if (calculationType === 'hour') {
                hourlyRate = salaryRate.hourlyRate || 0;
                baseSalary = regularWorkingHours * hourlyRate;
                halfDaySalary = 0;
                overtimeSalary = totalOvertimeHours * overtimeRatePerHour;
                totalSalary = baseSalary + overtimeSalary;
            }
            else if (calculationType === 'project') {
                projectRate = salaryRate.projectRate || 0;
                baseSalary = projectRate;
                halfDaySalary = 0;
                overtimeSalary = 0;
                totalSalary = projectRate;
            }
            const calculationData = {
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
            let calculation;
            if (existingCalculation && calculateSalaryDto.forceRecalculate) {
                const updatedCalculation = await this.salaryCalculationModel.findOneAndUpdate({ _id: existingCalculation._id }, { $set: calculationData }, { new: true }).exec();
                if (!updatedCalculation) {
                    throw new common_1.NotFoundException('Salary calculation not found for update');
                }
                calculation = updatedCalculation;
            }
            else {
                calculation = new this.salaryCalculationModel(calculationData);
                await calculation.save();
            }
            this.logger.log(`Salary calculated for user ${userId} for period ${periodStart} to ${periodEnd}`);
            return calculation;
        }, 'calculate salary');
    }
    validateSalaryRateData(calculationType, dailyRate, hourlyRate, projectRate, overtimeRatePerHour) {
        if (calculationType === 'day') {
            if (!dailyRate || dailyRate <= 0) {
                throw new common_1.BadRequestException('Daily rate is required and must be greater than 0 when calculationType is "day"');
            }
            if (hourlyRate && hourlyRate > 0) {
                throw new common_1.BadRequestException('Cannot set hourly rate when calculationType is "day". Only daily rate is allowed.');
            }
            if (projectRate && projectRate > 0) {
                throw new common_1.BadRequestException('Cannot set project rate when calculationType is "day". Only daily rate is allowed.');
            }
        }
        else if (calculationType === 'hour') {
            if (!hourlyRate || hourlyRate <= 0) {
                throw new common_1.BadRequestException('Hourly rate is required and must be greater than 0 when calculationType is "hour"');
            }
            if (dailyRate && dailyRate > 0) {
                throw new common_1.BadRequestException('Cannot set daily rate when calculationType is "hour". Only hourly rate is allowed.');
            }
            if (projectRate && projectRate > 0) {
                throw new common_1.BadRequestException('Cannot set project rate when calculationType is "hour". Only hourly rate is allowed.');
            }
        }
        else if (calculationType === 'project') {
            if (!projectRate || projectRate <= 0) {
                throw new common_1.BadRequestException('Project rate is required and must be greater than 0 when calculationType is "project"');
            }
            if (dailyRate && dailyRate > 0) {
                throw new common_1.BadRequestException('Cannot set daily rate when calculationType is "project". Only project rate is allowed.');
            }
            if (hourlyRate && hourlyRate > 0) {
                throw new common_1.BadRequestException('Cannot set hourly rate when calculationType is "project". Only project rate is allowed.');
            }
            if (overtimeRatePerHour && overtimeRatePerHour > 0) {
                throw new common_1.BadRequestException('Cannot set overtime rate when calculationType is "project". Overtime rate is not needed for project-based salary.');
            }
        }
    }
    validateProjectBasedSalary(calculationType, project) {
        if (calculationType === 'project' && !project) {
            throw new common_1.BadRequestException('Project is required when calculationType is "project". User must be assigned to a project.');
        }
    }
    async createSalaryRate(createSalaryRateDto) {
        return this.handleError(async () => {
            await this.validateUser(createSalaryRateDto.user);
            this.validateSalaryRateData(createSalaryRateDto.calculationType, createSalaryRateDto.dailyRate, createSalaryRateDto.hourlyRate, createSalaryRateDto.projectRate, createSalaryRateDto.overtimeRatePerHour);
            this.validateProjectBasedSalary(createSalaryRateDto.calculationType, createSalaryRateDto.project ? new mongoose_2.Types.ObjectId(createSalaryRateDto.project) : undefined);
            if (createSalaryRateDto.project) {
            }
            const effectiveFrom = createSalaryRateDto.effectiveFrom
                ? new Date(createSalaryRateDto.effectiveFrom)
                : new Date();
            if (createSalaryRateDto.project) {
                await this.salaryRateModel.updateMany({
                    user: createSalaryRateDto.user,
                    project: createSalaryRateDto.project,
                    isActive: true,
                    is_deleted: false
                }, {
                    $set: {
                        isActive: false,
                        effectiveTo: new Date(effectiveFrom.getTime() - 1)
                    }
                }).exec();
            }
            else {
                await this.salaryRateModel.updateMany({
                    user: createSalaryRateDto.user,
                    project: null,
                    isActive: true,
                    is_deleted: false
                }, {
                    $set: {
                        isActive: false,
                        effectiveTo: new Date(effectiveFrom.getTime() - 1)
                    }
                }).exec();
            }
            const salaryRateData = {
                ...createSalaryRateDto,
                user: new mongoose_2.Types.ObjectId(createSalaryRateDto.user),
                project: createSalaryRateDto.project ? new mongoose_2.Types.ObjectId(createSalaryRateDto.project) : null,
                effectiveFrom,
                effectiveTo: createSalaryRateDto.effectiveTo ? new Date(createSalaryRateDto.effectiveTo) : null,
                overtimeRatePerHour: createSalaryRateDto.overtimeRatePerHour || 0
            };
            if (createSalaryRateDto.calculationType === 'day') {
                salaryRateData.dailyRate = createSalaryRateDto.dailyRate;
                salaryRateData.hourlyRate = undefined;
                salaryRateData.projectRate = undefined;
                salaryRateData.overtimeRatePerHour = createSalaryRateDto.overtimeRatePerHour || 0;
            }
            else if (createSalaryRateDto.calculationType === 'hour') {
                salaryRateData.hourlyRate = createSalaryRateDto.hourlyRate;
                salaryRateData.dailyRate = undefined;
                salaryRateData.projectRate = undefined;
                salaryRateData.overtimeRatePerHour = createSalaryRateDto.overtimeRatePerHour || 0;
            }
            else if (createSalaryRateDto.calculationType === 'project') {
                salaryRateData.projectRate = createSalaryRateDto.projectRate;
                salaryRateData.dailyRate = undefined;
                salaryRateData.hourlyRate = undefined;
                salaryRateData.overtimeRatePerHour = 0;
            }
            const salaryRate = new this.salaryRateModel(salaryRateData);
            await salaryRate.save();
            this.logger.log(`Salary rate created: ${salaryRate._id}`);
            return { message: 'Salary rate created successfully' };
        }, 'create salary rate');
    }
    async getSalaryRates(filters) {
        return this.handleError(async () => {
            const query = { is_deleted: false };
            if (filters?.userId) {
                query.user = new mongoose_2.Types.ObjectId(filters.userId);
            }
            if (filters?.projectId) {
                query.project = filters.projectId === 'null' ? null : new mongoose_2.Types.ObjectId(filters.projectId);
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
    async getSalaryRateById(id) {
        return this.handleError(async () => {
            const rate = await this.salaryRateModel
                .findOne({ _id: id, is_deleted: false })
                .populate('user', 'name email mobile')
                .populate('project', 'name')
                .exec();
            if (!rate) {
                throw new common_1.NotFoundException('Salary rate not found');
            }
            return rate;
        }, 'fetch salary rate', id);
    }
    async updateSalaryRate(id, updateSalaryRateDto) {
        return this.handleError(async () => {
            const rate = await this.salaryRateModel.findOne({ _id: id, is_deleted: false }).exec();
            if (!rate) {
                throw new common_1.NotFoundException('Salary rate not found');
            }
            const calculationType = updateSalaryRateDto.calculationType || rate.calculationType;
            const dailyRate = updateSalaryRateDto.dailyRate !== undefined ? updateSalaryRateDto.dailyRate : rate.dailyRate;
            const hourlyRate = updateSalaryRateDto.hourlyRate !== undefined ? updateSalaryRateDto.hourlyRate : rate.hourlyRate;
            const projectRate = updateSalaryRateDto.projectRate !== undefined ? updateSalaryRateDto.projectRate : rate.projectRate;
            const overtimeRatePerHour = updateSalaryRateDto.overtimeRatePerHour !== undefined ? updateSalaryRateDto.overtimeRatePerHour : rate.overtimeRatePerHour;
            this.validateSalaryRateData(calculationType, dailyRate, hourlyRate, projectRate, overtimeRatePerHour);
            const updateData = { ...updateSalaryRateDto };
            if (updateData.project !== undefined) {
                updateData.project = updateData.project ? new mongoose_2.Types.ObjectId(updateData.project) : null;
            }
            if (updateData.effectiveFrom) {
                updateData.effectiveFrom = new Date(updateData.effectiveFrom);
            }
            if (updateData.effectiveTo) {
                updateData.effectiveTo = new Date(updateData.effectiveTo);
            }
            const finalCalculationType = updateData.calculationType || rate.calculationType;
            if (finalCalculationType === 'day') {
                if (updateData.dailyRate !== undefined) {
                    updateData.dailyRate = updateData.dailyRate;
                }
                updateData.hourlyRate = undefined;
                updateData.projectRate = undefined;
                updateData.overtimeRatePerHour = updateData.overtimeRatePerHour !== undefined ? updateData.overtimeRatePerHour : rate.overtimeRatePerHour;
            }
            else if (finalCalculationType === 'hour') {
                if (updateData.hourlyRate !== undefined) {
                    updateData.hourlyRate = updateData.hourlyRate;
                }
                updateData.dailyRate = undefined;
                updateData.projectRate = undefined;
                updateData.overtimeRatePerHour = updateData.overtimeRatePerHour !== undefined ? updateData.overtimeRatePerHour : rate.overtimeRatePerHour;
            }
            else if (finalCalculationType === 'project') {
                if (updateData.projectRate !== undefined) {
                    updateData.projectRate = updateData.projectRate;
                }
                updateData.dailyRate = undefined;
                updateData.hourlyRate = undefined;
                updateData.overtimeRatePerHour = 0;
            }
            const updatedRate = await this.salaryRateModel.findOneAndUpdate({ _id: id, is_deleted: false }, { $set: updateData }, { new: true }).exec();
            if (!updatedRate) {
                throw new common_1.NotFoundException('Salary rate not found or deleted');
            }
            this.logger.log(`Salary rate updated: ${id}`);
            return updatedRate.toObject();
        }, 'update salary rate', id);
    }
    async deleteSalaryRate(id) {
        return this.handleError(async () => {
            const rate = await this.salaryRateModel.findOneAndUpdate({ _id: id, is_deleted: false }, { $set: { is_deleted: true, isActive: false } }, { new: true }).exec();
            if (!rate) {
                throw new common_1.NotFoundException('Salary rate not found');
            }
            this.logger.log(`Salary rate soft-deleted: ${id}`);
            return { message: 'Salary rate deleted successfully' };
        }, 'delete salary rate', id);
    }
    async getSalaryCalculations(filters) {
        return this.handleError(async () => {
            const query = { is_deleted: false };
            if (filters?.userId) {
                const userId = typeof filters.userId === 'string' ? filters.userId : filters.userId.toString();
                query.user = new mongoose_2.Types.ObjectId(userId);
            }
            if (filters?.projectId) {
                const projectId = typeof filters.projectId === 'string' ? filters.projectId : filters.projectId.toString();
                query.project = projectId === 'null' ? null : new mongoose_2.Types.ObjectId(projectId);
            }
            if (filters?.periodType) {
                query.periodType = filters.periodType;
            }
            if (filters?.startDate || filters?.endDate) {
                if (filters.startDate && filters.endDate) {
                    query.periodStart = { $gte: new Date(filters.startDate), $lte: new Date(filters.endDate) };
                }
                else if (filters.startDate) {
                    query.periodStart = { $gte: new Date(filters.startDate) };
                }
                else if (filters.endDate) {
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
    async getSalaryCalculationById(id) {
        return this.handleError(async () => {
            const calculation = await this.salaryCalculationModel
                .findOne({ _id: id, is_deleted: false })
                .populate('user', 'name email mobile')
                .populate('project', 'name')
                .exec();
            if (!calculation) {
                throw new common_1.NotFoundException('Salary calculation not found');
            }
            return calculation;
        }, 'fetch salary calculation', id);
    }
    async updateSalaryCalculationStatus(id, status) {
        return this.handleError(async () => {
            const validStatuses = ['pending', 'calculated', 'approved', 'paid'];
            if (!validStatuses.includes(status)) {
                throw new common_1.BadRequestException(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
            }
            const updateData = { status };
            if (status === 'approved') {
                updateData.approvedAt = new Date();
            }
            else if (status === 'paid') {
                updateData.paidAt = new Date();
            }
            const calculation = await this.salaryCalculationModel.findOneAndUpdate({ _id: id, is_deleted: false }, { $set: updateData }, { new: true }).exec();
            if (!calculation) {
                throw new common_1.NotFoundException('Salary calculation not found');
            }
            this.logger.log(`Salary calculation status updated: ${id} to ${status}`);
            return calculation.toObject();
        }, 'update salary calculation status', id);
    }
    async deleteSalaryCalculation(id) {
        return this.handleError(async () => {
            const calculation = await this.salaryCalculationModel.findOneAndUpdate({ _id: id, is_deleted: false }, { $set: { is_deleted: true } }, { new: true }).exec();
            if (!calculation) {
                throw new common_1.NotFoundException('Salary calculation not found');
            }
            this.logger.log(`Salary calculation soft-deleted: ${id}`);
            return { message: 'Salary calculation deleted successfully' };
        }, 'delete salary calculation', id);
    }
};
exports.SalaryService = SalaryService;
exports.SalaryService = SalaryService = SalaryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(salary_rate_schema_1.SalaryRate.name)),
    __param(1, (0, mongoose_1.InjectModel)(salary_calculation_schema_1.SalaryCalculation.name)),
    __param(2, (0, mongoose_1.InjectModel)(attendance_schema_1.Attendance.name)),
    __param(3, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], SalaryService);
