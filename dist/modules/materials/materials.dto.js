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
exports.UpdateInsufficientStatusDto = exports.UpdateDeliveryStatusDto = exports.UpdateMaterialUsageDto = exports.UpdateMaterialDto = exports.CreateMaterialDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mongoose_1 = require("mongoose");
class CreateMaterialDto {
}
exports.CreateMaterialDto = CreateMaterialDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Cement' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaterialDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Portland cement for foundation work', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaterialDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['Raw Material', 'Equipment', 'Consumables', 'Tools', 'Other'],
        example: 'Raw Material'
    }),
    (0, class_validator_1.IsEnum)(['Raw Material', 'Equipment', 'Consumables', 'Tools', 'Other']),
    __metadata("design:type", String)
], CreateMaterialDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ABC Suppliers Ltd.' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaterialDto.prototype, "supplierName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'contact@abcsuppliers.com', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaterialDto.prototype, "supplierContact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '507f1f77bcf86cd799439011',
        description: 'Project ID (optional)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], CreateMaterialDto.prototype, "project", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, default: 0, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMaterialDto.prototype, "stockQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25, default: 0, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMaterialDto.prototype, "usedQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200, default: 0, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMaterialDto.prototype, "requiredQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500, default: 0, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMaterialDto.prototype, "costPerUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50000, default: 0, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMaterialDto.prototype, "totalCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'bags', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaterialDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-01', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateMaterialDto.prototype, "expectedDeliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-01', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateMaterialDto.prototype, "actualDeliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/invoice.pdf', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaterialDto.prototype, "invoiceUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/grn.pdf', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaterialDto.prototype, "grnUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['Pending', 'In Transit', 'Delivered', 'Partially Delivered', 'Cancelled'],
        default: 'Pending',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['Pending', 'In Transit', 'Delivered', 'Partially Delivered', 'Cancelled']),
    __metadata("design:type", String)
], CreateMaterialDto.prototype, "deliveryStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25, default: 0, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMaterialDto.prototype, "progressPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['https://example.com/doc1.pdf'], required: false, type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateMaterialDto.prototype, "documents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Handle with care', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMaterialDto.prototype, "remarks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: true, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateMaterialDto.prototype, "isActive", void 0);
class UpdateMaterialDto {
}
exports.UpdateMaterialDto = UpdateMaterialDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMaterialDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMaterialDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['Raw Material', 'Equipment', 'Consumables', 'Tools', 'Other']),
    __metadata("design:type", String)
], UpdateMaterialDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMaterialDto.prototype, "supplierName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMaterialDto.prototype, "supplierContact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], UpdateMaterialDto.prototype, "project", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateMaterialDto.prototype, "stockQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateMaterialDto.prototype, "usedQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateMaterialDto.prototype, "requiredQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateMaterialDto.prototype, "costPerUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateMaterialDto.prototype, "totalCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMaterialDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], UpdateMaterialDto.prototype, "expectedDeliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], UpdateMaterialDto.prototype, "actualDeliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMaterialDto.prototype, "invoiceUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMaterialDto.prototype, "grnUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['Pending', 'In Transit', 'Delivered', 'Partially Delivered', 'Cancelled']),
    __metadata("design:type", String)
], UpdateMaterialDto.prototype, "deliveryStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateMaterialDto.prototype, "progressPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateMaterialDto.prototype, "documents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMaterialDto.prototype, "remarks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateMaterialDto.prototype, "isActive", void 0);
class UpdateMaterialUsageDto {
}
exports.UpdateMaterialUsageDto = UpdateMaterialUsageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50, description: 'Additional quantity to add to existing used quantity (will be added to current usage)' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateMaterialUsageDto.prototype, "usedQuantity", void 0);
class UpdateDeliveryStatusDto {
}
exports.UpdateDeliveryStatusDto = UpdateDeliveryStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['Pending', 'In Transit', 'Delivered', 'Partially Delivered', 'Cancelled'],
        example: 'Delivered'
    }),
    (0, class_validator_1.IsEnum)(['Pending', 'In Transit', 'Delivered', 'Partially Delivered', 'Cancelled']),
    __metadata("design:type", String)
], UpdateDeliveryStatusDto.prototype, "deliveryStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-01', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], UpdateDeliveryStatusDto.prototype, "actualDeliveryDate", void 0);
class UpdateInsufficientStatusDto {
}
exports.UpdateInsufficientStatusDto = UpdateInsufficientStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Insufficient stock status' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateInsufficientStatusDto.prototype, "isInsufficient", void 0);
