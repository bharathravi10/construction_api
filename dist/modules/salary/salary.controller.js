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
exports.SalaryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const salary_dto_1 = require("./salary.dto");
const salary_service_1 = require("./salary.service");
let SalaryController = class SalaryController {
    constructor(salaryService) {
        this.salaryService = salaryService;
    }
    async createSalaryRate(createSalaryRateDto) {
        return this.salaryService.createSalaryRate(createSalaryRateDto);
    }
    async getSalaryRates(userId, projectId, isActive) {
        const filters = {};
        if (userId)
            filters.userId = userId;
        if (projectId)
            filters.projectId = projectId;
        if (isActive !== undefined)
            filters.isActive = isActive === 'true';
        return this.salaryService.getSalaryRates(filters);
    }
    async getSalaryRateById(id) {
        return this.salaryService.getSalaryRateById(id);
    }
    async updateSalaryRate(id, updateSalaryRateDto) {
        return this.salaryService.updateSalaryRate(id, updateSalaryRateDto);
    }
    async deleteSalaryRate(id) {
        return this.salaryService.deleteSalaryRate(id);
    }
    async calculateSalary(calculateSalaryDto) {
        return this.salaryService.calculateSalary(calculateSalaryDto);
    }
    async getSalaryCalculations(userId, projectId, periodType, startDate, endDate, status) {
        const filters = {
            ...(userId && { userId: userId }),
            ...(projectId && { projectId: projectId }),
            ...(periodType && { periodType: periodType }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
            ...(status && { status: status }),
        };
        return this.salaryService.getSalaryCalculations(filters);
    }
    async getSalaryCalculationById(id) {
        return this.salaryService.getSalaryCalculationById(id);
    }
    async updateSalaryCalculationStatus(id, status) {
        return this.salaryService.updateSalaryCalculationStatus(id, status);
    }
    async deleteSalaryCalculation(id) {
        return this.salaryService.deleteSalaryCalculation(id);
    }
};
exports.SalaryController = SalaryController;
__decorate([
    (0, common_1.Post)('rate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new salary rate for a user (with or without project)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Salary rate successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid input data.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found.' }),
    (0, swagger_1.ApiBody)({ type: salary_dto_1.CreateSalaryRateDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [salary_dto_1.CreateSalaryRateDto]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "createSalaryRate", null);
__decorate([
    (0, common_1.Get)('rate'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all salary rates (optionally filtered by user, project, or active status)' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, description: 'Filter by user ID' }),
    (0, swagger_1.ApiQuery)({ name: 'projectId', required: false, description: 'Filter by project ID (use "null" for base salary)' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, description: 'Filter by active status (true/false)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of salary rates.' }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('projectId')),
    __param(2, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "getSalaryRates", null);
__decorate([
    (0, common_1.Get)('rate/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a salary rate by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Salary rate ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Salary rate details.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Salary rate not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "getSalaryRateById", null);
__decorate([
    (0, common_1.Patch)('rate/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update salary rate details' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Salary rate ID' }),
    (0, swagger_1.ApiBody)({ type: salary_dto_1.UpdateSalaryRateDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Salary rate successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Salary rate not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, salary_dto_1.UpdateSalaryRateDto]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "updateSalaryRate", null);
__decorate([
    (0, common_1.Delete)('rate/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a salary rate' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Salary rate ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Salary rate successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Salary rate not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "deleteSalaryRate", null);
__decorate([
    (0, common_1.Post)('calculate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate salary for a user based on attendance records' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Salary successfully calculated.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid input data or calculation already exists.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User or salary rate not found.' }),
    (0, swagger_1.ApiBody)({ type: salary_dto_1.CalculateSalaryDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [salary_dto_1.CalculateSalaryDto]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "calculateSalary", null);
__decorate([
    (0, common_1.Get)('calculation'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all salary calculations (optionally filtered)' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, description: 'Filter by user ID' }),
    (0, swagger_1.ApiQuery)({ name: 'projectId', required: false, description: 'Filter by project ID' }),
    (0, swagger_1.ApiQuery)({ name: 'periodType', required: false, description: 'Filter by period type (month, week, year, custom)' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Filter by start date' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'Filter by end date' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'Filter by status (pending, calculated, approved, paid)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of salary calculations.' }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('projectId')),
    __param(2, (0, common_1.Query)('periodType')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __param(5, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "getSalaryCalculations", null);
__decorate([
    (0, common_1.Get)('calculation/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a salary calculation by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Salary calculation ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Salary calculation details.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Salary calculation not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "getSalaryCalculationById", null);
__decorate([
    (0, common_1.Patch)('calculation/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update salary calculation status (approve, mark as paid, etc.)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Salary calculation ID' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: true, description: 'New status (pending, calculated, approved, paid)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Salary calculation status successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid status.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Salary calculation not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "updateSalaryCalculationStatus", null);
__decorate([
    (0, common_1.Delete)('calculation/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a salary calculation' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Salary calculation ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Salary calculation successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Salary calculation not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "deleteSalaryCalculation", null);
exports.SalaryController = SalaryController = __decorate([
    (0, swagger_1.ApiTags)('Salary'),
    (0, common_1.Controller)('salary'),
    __metadata("design:paramtypes", [salary_service_1.SalaryService])
], SalaryController);
