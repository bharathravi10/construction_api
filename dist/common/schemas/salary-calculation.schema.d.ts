import { Document, Types } from 'mongoose';
export type SalaryCalculationDocument = SalaryCalculation & Document;
export declare class SalaryCalculation {
    user: Types.ObjectId;
    project?: Types.ObjectId;
    periodType: string;
    periodStart: Date;
    periodEnd: Date;
    totalDays: number;
    presentDays: number;
    halfDays: number;
    absentDays: number;
    totalOvertimeHours: number;
    calculationType: string;
    baseSalary: number;
    halfDaySalary: number;
    overtimeSalary: number;
    totalSalary: number;
    dailyRate: number;
    hourlyRate: number;
    projectRate: number;
    overtimeRatePerHour: number;
    totalWorkingHours: number;
    status: string;
    approvedAt?: Date;
    paidAt?: Date;
    remarks?: string;
    is_deleted: boolean;
}
export declare const SalaryCalculationSchema: import("mongoose").Schema<SalaryCalculation, import("mongoose").Model<SalaryCalculation, any, any, any, Document<unknown, any, SalaryCalculation> & SalaryCalculation & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SalaryCalculation, Document<unknown, {}, import("mongoose").FlatRecord<SalaryCalculation>> & import("mongoose").FlatRecord<SalaryCalculation> & {
    _id: Types.ObjectId;
}>;
//# sourceMappingURL=salary-calculation.schema.d.ts.map