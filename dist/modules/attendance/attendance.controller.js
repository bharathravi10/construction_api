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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const attendance_dto_1 = require("./attendance.dto");
const attendance_service_1 = require("./attendance.service");
let AttendanceController = class AttendanceController {
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    async create(createAttendanceDto) {
        return this.attendanceService.create(createAttendanceDto);
    }
    async findAll(userId, status, date, startDate, endDate) {
        return this.attendanceService.findAll({ userId, status, date, startDate, endDate });
    }
    async getAttendancesByUser(userId, status, startDate, endDate) {
        return this.attendanceService.getAttendancesByUser(userId, { status, startDate, endDate });
    }
    async getAttendanceByUserAndDate(userId, date) {
        return this.attendanceService.getAttendanceByUserAndDate(userId, date);
    }
    async findOne(id) {
        return this.attendanceService.findOne(id);
    }
    async update(id, updateAttendanceDto) {
        return this.attendanceService.update(id, updateAttendanceDto);
    }
    async remove(id) {
        return this.attendanceService.delete(id);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new attendance record' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Attendance successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid input data or attendance already exists.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found.' }),
    (0, swagger_1.ApiBody)({ type: attendance_dto_1.CreateAttendanceDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dto_1.CreateAttendanceDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all attendance records (optionally filtered by user, status, or date range)' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, description: 'Filter by user ID' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'Filter by status (present, absent, halfday)' }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: false, description: 'Filter by specific date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Filter by start date (YYYY-MM-DD) - use with endDate' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'Filter by end date (YYYY-MM-DD) - use with startDate' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of attendance records.' }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('date')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all attendance records for a specific user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'Filter by status (present, absent, halfday)' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Filter by start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'Filter by end date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of attendance records for the user.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found.' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendancesByUser", null);
__decorate([
    (0, common_1.Get)('user/:userId/date/:date'),
    (0, swagger_1.ApiOperation)({ summary: 'Get attendance record for a specific user and date' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiParam)({ name: 'date', description: 'Date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance record details.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Attendance record or user not found.' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendanceByUserAndDate", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an attendance record by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Attendance ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance record details.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Attendance record not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update attendance record details' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Attendance ID' }),
    (0, swagger_1.ApiBody)({ type: attendance_dto_1.UpdateAttendanceDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid input data.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Attendance record not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, attendance_dto_1.UpdateAttendanceDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete an attendance record' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Attendance ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Attendance record not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "remove", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, swagger_1.ApiTags)('Attendance'),
    (0, common_1.Controller)('attendance'),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
