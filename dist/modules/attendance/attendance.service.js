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
var AttendanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const attendance_schema_1 = require("../../common/schemas/attendance.schema");
const user_schema_1 = require("../../common/schemas/user.schema");
let AttendanceService = AttendanceService_1 = class AttendanceService {
    constructor(attendanceModel, userModel) {
        this.attendanceModel = attendanceModel;
        this.userModel = userModel;
        this.logger = new common_1.Logger(AttendanceService_1.name);
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
    validateAttendanceData(attendanceData) {
        const status = attendanceData.status;
        if (status === 'present' || status === 'halfday') {
            if (!attendanceData.checkIn) {
                throw new common_1.BadRequestException(`Check-in time is required for ${status} status`);
            }
        }
        if (attendanceData.checkOut && !attendanceData.checkIn) {
            throw new common_1.BadRequestException('Check-in time is required when check-out time is provided');
        }
        if (attendanceData.checkIn && attendanceData.checkOut) {
            const checkInTime = new Date(attendanceData.checkIn);
            const checkOutTime = new Date(attendanceData.checkOut);
            if (checkOutTime <= checkInTime) {
                throw new common_1.BadRequestException('Check-out time must be after check-in time');
            }
        }
    }
    async findAttendanceById(id) {
        const attendance = await this.attendanceModel
            .findOne({ _id: id, is_deleted: false })
            .exec();
        if (!attendance) {
            throw new common_1.NotFoundException('Attendance record not found');
        }
        return attendance;
    }
    async populateAttendanceDetails(attendance) {
        const attendanceObj = attendance.toObject();
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
    async populateAttendancesDetails(attendances) {
        if (attendances.length === 0)
            return [];
        const userIds = new Set();
        attendances.forEach(attendance => {
            if (attendance.user) {
                userIds.add(attendance.user.toString());
            }
        });
        const users = userIds.size > 0
            ? await this.userModel
                .find({ _id: { $in: Array.from(userIds) }, is_deleted: false })
                .select('_id name email mobile')
                .exec()
            : [];
        const userMap = new Map(users.map(u => [u._id.toString(), u]));
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
    prepareAttendanceData(attendanceData) {
        const prepared = { ...attendanceData };
        if (prepared.user) {
            prepared.user = new mongoose_2.Types.ObjectId(prepared.user);
        }
        if (prepared.date) {
            const date = new Date(prepared.date);
            date.setHours(0, 0, 0, 0);
            prepared.date = date;
        }
        return prepared;
    }
    async create(createAttendanceDto) {
        return this.handleError(async () => {
            await this.validateUser(createAttendanceDto.user);
            this.validateAttendanceData(createAttendanceDto);
            const attendanceData = this.prepareAttendanceData(createAttendanceDto);
            const existingAttendance = await this.attendanceModel.findOne({
                user: attendanceData.user,
                date: attendanceData.date,
                is_deleted: false
            }).exec();
            if (existingAttendance) {
                throw new common_1.BadRequestException('Attendance record already exists for this user on this date');
            }
            const createdAttendance = new this.attendanceModel(attendanceData);
            await createdAttendance.save();
            this.logger.log(`Attendance created: ${createdAttendance._id}`);
            return { message: 'Attendance created successfully' };
        }, 'create attendance');
    }
    async findAll(filters) {
        return this.handleError(async () => {
            const query = { is_deleted: false };
            if (filters?.userId) {
                query.user = new mongoose_2.Types.ObjectId(filters.userId);
            }
            if (filters?.status) {
                query.status = filters.status;
            }
            if (filters?.date) {
                const date = new Date(filters.date);
                date.setHours(0, 0, 0, 0);
                const nextDay = new Date(date);
                nextDay.setDate(nextDay.getDate() + 1);
                query.date = { $gte: date, $lt: nextDay };
            }
            else if (filters?.startDate || filters?.endDate) {
                if (filters.startDate && filters.endDate) {
                    const startDate = new Date(filters.startDate);
                    startDate.setHours(0, 0, 0, 0);
                    const endDate = new Date(filters.endDate);
                    endDate.setHours(23, 59, 59, 999);
                    query.date = { $gte: startDate, $lte: endDate };
                }
                else if (filters.startDate) {
                    const startDate = new Date(filters.startDate);
                    startDate.setHours(0, 0, 0, 0);
                    query.date = { $gte: startDate };
                }
                else if (filters.endDate) {
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
    async findOne(id) {
        return this.handleError(async () => {
            const attendance = await this.attendanceModel
                .findOne({ _id: id, is_deleted: false })
                .select('-createdAt -updatedAt -__v -is_deleted')
                .exec();
            if (!attendance) {
                throw new common_1.NotFoundException('Attendance record not found');
            }
            return this.populateAttendanceDetails(attendance);
        }, 'fetch attendance', id);
    }
    async update(id, updateAttendanceDto) {
        return this.handleError(async () => {
            const existingAttendance = await this.findAttendanceById(id);
            const mergedData = {
                ...existingAttendance.toObject(),
                ...updateAttendanceDto
            };
            this.validateAttendanceData(mergedData);
            const updateData = { ...updateAttendanceDto };
            if (updateData.date) {
                const date = new Date(updateData.date);
                date.setHours(0, 0, 0, 0);
                updateData.date = date;
            }
            const attendance = await this.attendanceModel
                .findOneAndUpdate({ _id: id, is_deleted: false }, { $set: updateData }, { new: true })
                .select('-createdAt -updatedAt -__v -is_deleted')
                .exec();
            if (!attendance) {
                throw new common_1.NotFoundException('Attendance record not found or deleted');
            }
            this.logger.log(`Attendance updated: ${id}`);
            return attendance.toObject();
        }, 'update attendance', id);
    }
    async softDelete(id) {
        return this.handleError(async () => {
            const attendance = await this.attendanceModel.findOneAndUpdate({ _id: id, is_deleted: false }, { $set: { is_deleted: true } }, { new: true }).exec();
            if (!attendance) {
                throw new common_1.NotFoundException('Attendance record not found');
            }
            this.logger.log(`Attendance soft-deleted: ${id}`);
            return { message: 'Attendance deleted successfully' };
        }, 'delete attendance', id);
    }
    async delete(id) {
        return this.softDelete(id);
    }
    async getAttendanceByUserAndDate(userId, date) {
        return this.handleError(async () => {
            await this.validateUser(userId);
            const attendanceDate = new Date(date);
            attendanceDate.setHours(0, 0, 0, 0);
            const nextDay = new Date(attendanceDate);
            nextDay.setDate(nextDay.getDate() + 1);
            const attendance = await this.attendanceModel
                .findOne({
                user: new mongoose_2.Types.ObjectId(userId),
                date: { $gte: attendanceDate, $lt: nextDay },
                is_deleted: false
            })
                .select('-createdAt -updatedAt -__v -is_deleted')
                .exec();
            if (!attendance) {
                throw new common_1.NotFoundException('Attendance record not found for this user and date');
            }
            return this.populateAttendanceDetails(attendance);
        }, 'fetch attendance by user and date', `${userId}-${date}`);
    }
    async getAttendancesByUser(userId, filters) {
        return this.handleError(async () => {
            await this.validateUser(userId);
            const query = {
                user: new mongoose_2.Types.ObjectId(userId),
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
                }
                else if (filters.startDate) {
                    const startDate = new Date(filters.startDate);
                    startDate.setHours(0, 0, 0, 0);
                    query.date = { $gte: startDate };
                }
                else if (filters.endDate) {
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
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = AttendanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(attendance_schema_1.Attendance.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AttendanceService);
