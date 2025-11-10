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
exports.GetSalaryCalculationDto = exports.CalculateSalaryDto = exports.UpdateSalaryRateDto = exports.CreateSalaryRateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mongoose_1 = require("mongoose");
class CreateSalaryRateDto {
}
exports.CreateSalaryRateDto = CreateSalaryRateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '507f1f77bcf86cd799439011',
        description: 'User ID (required)'
    }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], CreateSalaryRateDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '507f1f77bcf86cd799439012',
        required: false,
        description: 'Project ID (optional - null means base/default salary for user. Required when calculationType is "project")'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], CreateSalaryRateDto.prototype, "project", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['day', 'hour', 'project'],
        example: 'day',
        description: 'Calculation type: "day" for day-based, "hour" for hour-based, "project" for project-based salary'
    }),
    (0, class_validator_1.IsEnum)(['day', 'hour', 'project']),
    __metadata("design:type", String)
], CreateSalaryRateDto.prototype, "calculationType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1000.00,
        required: false,
        description: 'Daily salary rate in currency (required if calculationType is "day")'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateSalaryRateDto.prototype, "dailyRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 125.00,
        required: false,
        description: 'Hourly salary rate in currency (required if calculationType is "hour")'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateSalaryRateDto.prototype, "hourlyRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 50000.00,
        required: false,
        description: 'Project-based salary rate in currency (required if calculationType is "project")'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateSalaryRateDto.prototype, "projectRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 100.00,
        default: 0,
        required: false,
        description: 'Overtime rate per hour in currency (not needed for project-based)'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateSalaryRateDto.prototype, "overtimeRatePerHour", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-12-01',
        required: false,
        description: 'Effective from date (defaults to today)'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateSalaryRateDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2025-12-31',
        required: false,
        description: 'Effective to date (null means currently active)'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateSalaryRateDto.prototype, "effectiveTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Additional notes', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSalaryRateDto.prototype, "remarks", void 0);
class UpdateSalaryRateDto {
}
exports.UpdateSalaryRateDto = UpdateSalaryRateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], UpdateSalaryRateDto.prototype, "project", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['day', 'hour', 'project'],
        required: false,
        description: 'Calculation type: "day" for day-based, "hour" for hour-based, "project" for project-based salary'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['day', 'hour', 'project']),
    __metadata("design:type", String)
], UpdateSalaryRateDto.prototype, "calculationType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateSalaryRateDto.prototype, "dailyRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateSalaryRateDto.prototype, "hourlyRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateSalaryRateDto.prototype, "projectRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateSalaryRateDto.prototype, "overtimeRatePerHour", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], UpdateSalaryRateDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], UpdateSalaryRateDto.prototype, "effectiveTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSalaryRateDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSalaryRateDto.prototype, "remarks", void 0);
class CalculateSalaryDto {
}
exports.CalculateSalaryDto = CalculateSalaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '507f1f77bcf86cd799439011',
        description: 'User ID (required)'
    }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], CalculateSalaryDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '507f1f77bcf86cd799439012',
        required: false,
        description: 'Project ID (optional - null means calculate for all projects or base salary)'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], CalculateSalaryDto.prototype, "project", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['month', 'week', 'year', 'custom'],
        example: 'month',
        description: 'Period type for calculation'
    }),
    (0, class_validator_1.IsEnum)(['month', 'week', 'year', 'custom']),
    __metadata("design:type", String)
], CalculateSalaryDto.prototype, "periodType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-12-01',
        description: 'Start date of the period'
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CalculateSalaryDto.prototype, "periodStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-12-31',
        description: 'End date of the period'
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CalculateSalaryDto.prototype, "periodEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        default: false,
        required: false,
        description: 'If true, recalculate even if calculation already exists'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CalculateSalaryDto.prototype, "forceRecalculate", void 0);
class GetSalaryCalculationDto {
}
exports.GetSalaryCalculationDto = GetSalaryCalculationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '507f1f77bcf86cd799439011',
        required: false,
        description: 'Filter by user ID'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], GetSalaryCalculationDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '507f1f77bcf86cd799439012',
        required: false,
        description: 'Filter by project ID'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], GetSalaryCalculationDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['month', 'week', 'year', 'custom'],
        required: false,
        description: 'Filter by period type'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['month', 'week', 'year', 'custom']),
    __metadata("design:type", String)
], GetSalaryCalculationDto.prototype, "periodType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-12-01',
        required: false,
        description: 'Filter by start date'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GetSalaryCalculationDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-12-31',
        required: false,
        description: 'Filter by end date'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GetSalaryCalculationDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['pending', 'calculated', 'approved', 'paid'],
        required: false,
        description: 'Filter by status'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['pending', 'calculated', 'approved', 'paid']),
    __metadata("design:type", String)
], GetSalaryCalculationDto.prototype, "status", void 0);
