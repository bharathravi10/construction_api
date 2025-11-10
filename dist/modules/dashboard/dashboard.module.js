"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const projects_schema_1 = require("../../common/schemas/projects.schema");
const user_schema_1 = require("../../common/schemas/user.schema");
const attendance_schema_1 = require("../../common/schemas/attendance.schema");
const salary_calculation_schema_1 = require("../../common/schemas/salary-calculation.schema");
const material_schema_1 = require("../../common/schemas/material.schema");
const task_schema_1 = require("../../common/schemas/task.schema");
const dashboard_service_1 = require("./dashboard.service");
const dashboard_controller_1 = require("./dashboard.controller");
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: projects_schema_1.Project.name, schema: projects_schema_1.ProjectSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: attendance_schema_1.Attendance.name, schema: attendance_schema_1.AttendanceSchema },
                { name: salary_calculation_schema_1.SalaryCalculation.name, schema: salary_calculation_schema_1.SalaryCalculationSchema },
                { name: material_schema_1.Material.name, schema: material_schema_1.MaterialSchema },
                { name: task_schema_1.Task.name, schema: task_schema_1.TaskSchema },
            ]),
        ],
        controllers: [dashboard_controller_1.DashboardController],
        providers: [dashboard_service_1.DashboardService],
        exports: [dashboard_service_1.DashboardService],
    })
], DashboardModule);
