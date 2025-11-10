"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaryModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const salary_rate_schema_1 = require("../../common/schemas/salary-rate.schema");
const salary_calculation_schema_1 = require("../../common/schemas/salary-calculation.schema");
const attendance_schema_1 = require("../../common/schemas/attendance.schema");
const user_schema_1 = require("../../common/schemas/user.schema");
const salary_service_1 = require("./salary.service");
const salary_controller_1 = require("./salary.controller");
let SalaryModule = class SalaryModule {
};
exports.SalaryModule = SalaryModule;
exports.SalaryModule = SalaryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: salary_rate_schema_1.SalaryRate.name, schema: salary_rate_schema_1.SalaryRateSchema },
                { name: salary_calculation_schema_1.SalaryCalculation.name, schema: salary_calculation_schema_1.SalaryCalculationSchema },
                { name: attendance_schema_1.Attendance.name, schema: attendance_schema_1.AttendanceSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema }
            ])
        ],
        controllers: [salary_controller_1.SalaryController],
        providers: [salary_service_1.SalaryService],
    })
], SalaryModule);
