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
exports.TaskSchema = exports.Task = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const IssueSchemaDefinition = new mongoose_2.Schema({
    title: { type: String, required: true },
    description: { type: String },
    severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Low' },
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
    reportedDate: { type: Date, default: Date.now },
    resolvedDate: { type: Date },
    reportedBy: { type: String },
    resolvedBy: { type: String },
    remarks: { type: String },
}, { _id: false });
let Task = class Task {
    constructor() {
        this.status = 'Assigned';
        this.issues = [];
        this.progressPercentage = 0;
        this.assignedUsers = [];
        this.documents = [];
        this.isActive = true;
        this.is_deleted = false;
    }
};
exports.Task = Task;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Task.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Project', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Task.prototype, "project", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], Task.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], Task.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Task.prototype, "actualStartDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Task.prototype, "actualEndDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Assigned', enum: ['Assigned', 'In Progress', 'Completed'] }),
    __metadata("design:type", String)
], Task.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [IssueSchemaDefinition], default: [] }),
    __metadata("design:type", Array)
], Task.prototype, "issues", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Task.prototype, "progressPercentage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], ref: 'User', default: [] }),
    __metadata("design:type", Array)
], Task.prototype, "assignedUsers", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Task.prototype, "remarks", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Task.prototype, "documents", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Task.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Task.prototype, "is_deleted", void 0);
exports.Task = Task = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'tasks' })
], Task);
exports.TaskSchema = mongoose_1.SchemaFactory.createForClass(Task);
