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
exports.SalaryRateSchema = exports.SalaryRate = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let SalaryRate = class SalaryRate {
    constructor() {
        this.overtimeRatePerHour = 0;
        this.isActive = true;
        this.is_deleted = false;
    }
};
exports.SalaryRate = SalaryRate;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SalaryRate.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Project', required: false }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SalaryRate.prototype, "project", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['day', 'hour', 'project'],
        required: true,
        default: 'day'
    }),
    __metadata("design:type", String)
], SalaryRate.prototype, "calculationType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: false }),
    __metadata("design:type", Number)
], SalaryRate.prototype, "dailyRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: false }),
    __metadata("design:type", Number)
], SalaryRate.prototype, "hourlyRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: false }),
    __metadata("design:type", Number)
], SalaryRate.prototype, "projectRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], SalaryRate.prototype, "overtimeRatePerHour", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], SalaryRate.prototype, "effectiveFrom", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], SalaryRate.prototype, "effectiveTo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], SalaryRate.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], SalaryRate.prototype, "is_deleted", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SalaryRate.prototype, "remarks", void 0);
exports.SalaryRate = SalaryRate = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'salary_rates' })
], SalaryRate);
exports.SalaryRateSchema = mongoose_1.SchemaFactory.createForClass(SalaryRate);
exports.SalaryRateSchema.index({ user: 1, project: 1, effectiveFrom: 1 });
exports.SalaryRateSchema.index({ user: 1, project: 1, isActive: 1, is_deleted: 1 });
