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
exports.MaterialSchema = exports.Material = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Material = class Material {
    constructor() {
        this.stockQuantity = 0;
        this.usedQuantity = 0;
        this.requiredQuantity = 0;
        this.costPerUnit = 0;
        this.totalCost = 0;
        this.deliveryStatus = 'Pending';
        this.progressPercentage = 0;
        this.documents = [];
        this.isInsufficient = false;
        this.isActive = true;
        this.is_deleted = false;
    }
};
exports.Material = Material;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Material.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Material.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['Raw Material', 'Equipment', 'Consumables', 'Tools', 'Other'] }),
    __metadata("design:type", String)
], Material.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Material.prototype, "supplierName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Material.prototype, "supplierContact", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Project' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Material.prototype, "project", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Material.prototype, "stockQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Material.prototype, "usedQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Material.prototype, "requiredQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Material.prototype, "costPerUnit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Material.prototype, "totalCost", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Material.prototype, "unit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Material.prototype, "expectedDeliveryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Material.prototype, "actualDeliveryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Material.prototype, "invoiceUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Material.prototype, "grnUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Pending', enum: ['Pending', 'In Transit', 'Delivered', 'Partially Delivered', 'Cancelled'] }),
    __metadata("design:type", String)
], Material.prototype, "deliveryStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Material.prototype, "progressPercentage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Material.prototype, "documents", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Material.prototype, "remarks", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Material.prototype, "isInsufficient", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Material.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Material.prototype, "is_deleted", void 0);
exports.Material = Material = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'materials' })
], Material);
exports.MaterialSchema = mongoose_1.SchemaFactory.createForClass(Material);
