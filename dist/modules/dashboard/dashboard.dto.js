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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardAnalyticsResponseDto = exports.UsersAnalyticsResponseDto = exports.TasksAnalyticsResponseDto = exports.MaterialsAnalyticsResponseDto = exports.SalaryAnalyticsResponseDto = exports.AttendanceAnalyticsResponseDto = exports.ProjectsAnalyticsResponseDto = exports.DashboardQueryDto = exports.PeriodType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mongoose_1 = require("mongoose");
var PeriodType;
(function (PeriodType) {
    PeriodType["DAY"] = "day";
    PeriodType["WEEK"] = "week";
    PeriodType["MONTH"] = "month";
})(PeriodType || (exports.PeriodType = PeriodType = {}));
class DashboardQueryDto {
}
exports.DashboardQueryDto = DashboardQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: PeriodType,
        example: 'month',
        required: false,
        description: 'Period type: day, week, or month',
        default: 'month',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(PeriodType),
    __metadata("design:type", String)
], DashboardQueryDto.prototype, "periodType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-12-01',
        required: false,
        description: 'Start date for the period (defaults to start of current period)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DashboardQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-12-31',
        required: false,
        description: 'End date for the period (defaults to end of current period)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DashboardQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '507f1f77bcf86cd799439012',
        required: false,
        description: 'Filter by project ID',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], DashboardQueryDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '507f1f77bcf86cd799439011',
        required: false,
        description: 'Filter by user ID',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], DashboardQueryDto.prototype, "userId", void 0);
class ProjectsAnalyticsResponseDto {
}
exports.ProjectsAnalyticsResponseDto = ProjectsAnalyticsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProjectsAnalyticsResponseDto.prototype, "totalProjects", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProjectsAnalyticsResponseDto.prototype, "activeProjects", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ProjectsAnalyticsResponseDto.prototype, "projectsCreated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'array' }),
    __metadata("design:type", Array)
], ProjectsAnalyticsResponseDto.prototype, "projectsByStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ProjectsAnalyticsResponseDto.prototype, "budgetStats", void 0);
class AttendanceAnalyticsResponseDto {
}
exports.AttendanceAnalyticsResponseDto = AttendanceAnalyticsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AttendanceAnalyticsResponseDto.prototype, "totalRecords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AttendanceAnalyticsResponseDto.prototype, "uniqueUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AttendanceAnalyticsResponseDto.prototype, "presentCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AttendanceAnalyticsResponseDto.prototype, "absentCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AttendanceAnalyticsResponseDto.prototype, "halfdayCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AttendanceAnalyticsResponseDto.prototype, "attendanceRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AttendanceAnalyticsResponseDto.prototype, "totalOvertimeMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AttendanceAnalyticsResponseDto.prototype, "totalOvertimeHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'array' }),
    __metadata("design:type", Array)
], AttendanceAnalyticsResponseDto.prototype, "attendanceByStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'array' }),
    __metadata("design:type", Array)
], AttendanceAnalyticsResponseDto.prototype, "dailyBreakdown", void 0);
class SalaryAnalyticsResponseDto {
}
exports.SalaryAnalyticsResponseDto = SalaryAnalyticsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SalaryAnalyticsResponseDto.prototype, "totalSalary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SalaryAnalyticsResponseDto.prototype, "totalBaseSalary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SalaryAnalyticsResponseDto.prototype, "totalOvertimeSalary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SalaryAnalyticsResponseDto.prototype, "totalHalfDaySalary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SalaryAnalyticsResponseDto.prototype, "totalRecords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SalaryAnalyticsResponseDto.prototype, "avgSalary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SalaryAnalyticsResponseDto.prototype, "uniqueUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'array' }),
    __metadata("design:type", Array)
], SalaryAnalyticsResponseDto.prototype, "salaryByStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'array' }),
    __metadata("design:type", Array)
], SalaryAnalyticsResponseDto.prototype, "salaryByCalculationType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'array' }),
    __metadata("design:type", Array)
], SalaryAnalyticsResponseDto.prototype, "periodBreakdown", void 0);
class MaterialsAnalyticsResponseDto {
}
exports.MaterialsAnalyticsResponseDto = MaterialsAnalyticsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MaterialsAnalyticsResponseDto.prototype, "totalMaterials", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MaterialsAnalyticsResponseDto.prototype, "materialsCreated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], MaterialsAnalyticsResponseDto.prototype, "materialCosts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'array' }),
    __metadata("design:type", Array)
], MaterialsAnalyticsResponseDto.prototype, "materialsByCategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'array' }),
    __metadata("design:type", Array)
], MaterialsAnalyticsResponseDto.prototype, "materialsByDeliveryStatus", void 0);
class TasksAnalyticsResponseDto {
}
exports.TasksAnalyticsResponseDto = TasksAnalyticsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TasksAnalyticsResponseDto.prototype, "totalTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TasksAnalyticsResponseDto.prototype, "tasksCreated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TasksAnalyticsResponseDto.prototype, "tasksCompleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TasksAnalyticsResponseDto.prototype, "tasksWithIssues", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], TasksAnalyticsResponseDto.prototype, "avgProgress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'array' }),
    __metadata("design:type", Array)
], TasksAnalyticsResponseDto.prototype, "tasksByStatus", void 0);
class UsersAnalyticsResponseDto {
}
exports.UsersAnalyticsResponseDto = UsersAnalyticsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UsersAnalyticsResponseDto.prototype, "totalUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UsersAnalyticsResponseDto.prototype, "activeUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UsersAnalyticsResponseDto.prototype, "usersCreated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'array' }),
    __metadata("design:type", Array)
], UsersAnalyticsResponseDto.prototype, "usersByRole", void 0);
class DashboardAnalyticsResponseDto {
}
exports.DashboardAnalyticsResponseDto = DashboardAnalyticsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], DashboardAnalyticsResponseDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ProjectsAnalyticsResponseDto }),
    __metadata("design:type", ProjectsAnalyticsResponseDto)
], DashboardAnalyticsResponseDto.prototype, "projects", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AttendanceAnalyticsResponseDto }),
    __metadata("design:type", AttendanceAnalyticsResponseDto)
], DashboardAnalyticsResponseDto.prototype, "attendance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SalaryAnalyticsResponseDto }),
    __metadata("design:type", SalaryAnalyticsResponseDto)
], DashboardAnalyticsResponseDto.prototype, "salary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: MaterialsAnalyticsResponseDto }),
    __metadata("design:type", MaterialsAnalyticsResponseDto)
], DashboardAnalyticsResponseDto.prototype, "materials", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: TasksAnalyticsResponseDto }),
    __metadata("design:type", TasksAnalyticsResponseDto)
], DashboardAnalyticsResponseDto.prototype, "tasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: UsersAnalyticsResponseDto }),
    __metadata("design:type", UsersAnalyticsResponseDto)
], DashboardAnalyticsResponseDto.prototype, "users", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], DashboardAnalyticsResponseDto.prototype, "summary", void 0);
