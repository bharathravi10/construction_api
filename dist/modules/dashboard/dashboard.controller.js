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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dashboard_service_1 = require("./dashboard.service");
const dashboard_dto_1 = require("./dashboard.dto");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getDashboard(query) {
        return this.dashboardService.getDashboardAnalytics(query);
    }
    getProjectsAnalytics(query) {
        return this.dashboardService.getProjectsAnalytics(query);
    }
    getAttendanceAnalytics(query) {
        return this.dashboardService.getAttendanceAnalytics(query);
    }
    getSalaryAnalytics(query) {
        return this.dashboardService.getSalaryAnalytics(query);
    }
    getMaterialsAnalytics(query) {
        return this.dashboardService.getMaterialsAnalytics(query);
    }
    getTasksAnalytics(query) {
        return this.dashboardService.getTasksAnalytics(query);
    }
    getUsersAnalytics(query) {
        return this.dashboardService.getUsersAnalytics(query);
    }
    getDayWiseAnalytics(query) {
        return this.dashboardService.getDashboardAnalytics({
            ...query,
            periodType: dashboard_dto_1.PeriodType.DAY,
        });
    }
    getWeekWiseAnalytics(query) {
        return this.dashboardService.getDashboardAnalytics({
            ...query,
            periodType: dashboard_dto_1.PeriodType.WEEK,
        });
    }
    getMonthWiseAnalytics(query) {
        return this.dashboardService.getDashboardAnalytics({
            ...query,
            periodType: dashboard_dto_1.PeriodType.MONTH,
        });
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get comprehensive dashboard analytics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Dashboard analytics retrieved successfully.',
        type: dashboard_dto_1.DashboardAnalyticsResponseDto,
    }),
    (0, swagger_1.ApiQuery)({ name: 'periodType', enum: dashboard_dto_1.PeriodType, required: false, description: 'Period type: day, week, or month' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Start date for the period' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'End date for the period' }),
    (0, swagger_1.ApiQuery)({ name: 'projectId', required: false, description: 'Filter by project ID' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, description: 'Filter by user ID' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_dto_1.DashboardQueryDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('projects'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get projects analytics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Projects analytics retrieved successfully.',
        type: dashboard_dto_1.ProjectsAnalyticsResponseDto,
    }),
    (0, swagger_1.ApiQuery)({ name: 'periodType', enum: dashboard_dto_1.PeriodType, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'projectId', required: false }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_dto_1.DashboardQueryDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getProjectsAnalytics", null);
__decorate([
    (0, common_1.Get)('attendance'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get attendance analytics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Attendance analytics retrieved successfully.',
        type: dashboard_dto_1.AttendanceAnalyticsResponseDto,
    }),
    (0, swagger_1.ApiQuery)({ name: 'periodType', enum: dashboard_dto_1.PeriodType, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_dto_1.DashboardQueryDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAttendanceAnalytics", null);
__decorate([
    (0, common_1.Get)('salary'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get salary analytics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Salary analytics retrieved successfully.',
        type: dashboard_dto_1.SalaryAnalyticsResponseDto,
    }),
    (0, swagger_1.ApiQuery)({ name: 'periodType', enum: dashboard_dto_1.PeriodType, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'projectId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_dto_1.DashboardQueryDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSalaryAnalytics", null);
__decorate([
    (0, common_1.Get)('materials'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get materials analytics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Materials analytics retrieved successfully.',
        type: dashboard_dto_1.MaterialsAnalyticsResponseDto,
    }),
    (0, swagger_1.ApiQuery)({ name: 'periodType', enum: dashboard_dto_1.PeriodType, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'projectId', required: false }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_dto_1.DashboardQueryDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getMaterialsAnalytics", null);
__decorate([
    (0, common_1.Get)('tasks'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get tasks analytics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tasks analytics retrieved successfully.',
        type: dashboard_dto_1.TasksAnalyticsResponseDto,
    }),
    (0, swagger_1.ApiQuery)({ name: 'periodType', enum: dashboard_dto_1.PeriodType, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'projectId', required: false }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_dto_1.DashboardQueryDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getTasksAnalytics", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get users analytics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Users analytics retrieved successfully.',
        type: dashboard_dto_1.UsersAnalyticsResponseDto,
    }),
    (0, swagger_1.ApiQuery)({ name: 'periodType', enum: dashboard_dto_1.PeriodType, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_dto_1.DashboardQueryDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getUsersAnalytics", null);
__decorate([
    (0, common_1.Get)('day'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get day-wise dashboard analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Day-wise analytics retrieved successfully.' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Specific date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'projectId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_dto_1.DashboardQueryDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getDayWiseAnalytics", null);
__decorate([
    (0, common_1.Get)('week'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get week-wise dashboard analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Week-wise analytics retrieved successfully.' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Start date of the week' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'End date of the week' }),
    (0, swagger_1.ApiQuery)({ name: 'projectId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_dto_1.DashboardQueryDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getWeekWiseAnalytics", null);
__decorate([
    (0, common_1.Get)('month'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get month-wise dashboard analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Month-wise analytics retrieved successfully.' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Start date of the month' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'End date of the month' }),
    (0, swagger_1.ApiQuery)({ name: 'projectId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_dto_1.DashboardQueryDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getMonthWiseAnalytics", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
