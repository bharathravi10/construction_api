"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const configuration_1 = __importDefault(require("./config/configuration"));
const role_module_1 = require("./modules/role/role.module");
const user_details_module_1 = require("./modules/user-details/user-details.module");
const auth_module_1 = require("./modules/auth/auth.module");
const projects_module_1 = require("./modules/projects/projects.module");
const materials_module_1 = require("./modules/materials/materials.module");
const tasks_module_1 = require("./modules/tasks/tasks.module");
const attendance_module_1 = require("./modules/attendance/attendance.module");
const salary_module_1 = require("./modules/salary/salary.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const s3_upload_module_1 = require("./common/s3-upload/s3-upload.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [configuration_1.default],
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    uri: configService.get('MONGO_URI'),
                }),
            }),
            auth_module_1.AuthModule,
            projects_module_1.ProjectsModule,
            role_module_1.RolesModule,
            user_details_module_1.UserDetailsModule,
            materials_module_1.MaterialsModule,
            tasks_module_1.TasksModule,
            attendance_module_1.AttendanceModule,
            salary_module_1.SalaryModule,
            dashboard_module_1.DashboardModule,
            s3_upload_module_1.S3UploadModule,
        ],
    })
], AppModule);
