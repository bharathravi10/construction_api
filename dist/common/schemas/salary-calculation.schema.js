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
exports.SalaryCalculationSchema = exports.SalaryCalculation = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let SalaryCalculation = class SalaryCalculation {
    constructor() {
        this.totalDays = 0;
        this.presentDays = 0;
        this.halfDays = 0;
        this.absentDays = 0;
        this.totalOvertimeHours = 0;
        this.calculationType = 'day';
        this.baseSalary = 0;
        this.halfDaySalary = 0;
        this.overtimeSalary = 0;
        this.totalSalary = 0;
        this.dailyRate = 0;
        this.hourlyRate = 0;
        this.projectRate = 0;
        this.overtimeRatePerHour = 0;
        this.totalWorkingHours = 0;
        this.status = 'pending';
        this.is_deleted = false;
    }
};
exports.SalaryCalculation = SalaryCalculation;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SalaryCalculation.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Project', required: false }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SalaryCalculation.prototype, "project", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], SalaryCalculation.prototype, "periodType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], SalaryCalculation.prototype, "periodStart", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], SalaryCalculation.prototype, "periodEnd", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], SalaryCalculation.prototype, "totalDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], SalaryCalculation.prototype, "presentDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], SalaryCalculation.prototype, "halfDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], SalaryCalculation.prototype, "absentDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], SalaryCalculation.prototype, "totalOvertimeHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['day', 'hour', 'project'],
        default: 'day'
    }),
    __metadata("design:type", String)
], SalaryCalculation.prototype, "calculationType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], SalaryCalculation.prototype, "baseSalary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], SalaryCalculation.prototype, "halfDaySalary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], SalaryCalculation.prototype, "overtimeSalary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], SalaryCalculation.prototype, "totalSalary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], SalaryCalculation.prototype, "dailyRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], SalaryCalculation.prototype, "hourlyRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], SalaryCalculation.prototype, "projectRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], SalaryCalculation.prototype, "overtimeRatePerHour", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], SalaryCalculation.prototype, "totalWorkingHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: 'pending' }),
    __metadata("design:type", String)
], SalaryCalculation.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], SalaryCalculation.prototype, "approvedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], SalaryCalculation.prototype, "paidAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SalaryCalculation.prototype, "remarks", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], SalaryCalculation.prototype, "is_deleted", void 0);
exports.SalaryCalculation = SalaryCalculation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'salary_calculations' })
], SalaryCalculation);
exports.SalaryCalculationSchema = mongoose_1.SchemaFactory.createForClass(SalaryCalculation);
exports.SalaryCalculationSchema.index({ user: 1, project: 1, periodStart: 1, periodEnd: 1 });
exports.SalaryCalculationSchema.index({ user: 1, periodType: 1, periodStart: 1 });
