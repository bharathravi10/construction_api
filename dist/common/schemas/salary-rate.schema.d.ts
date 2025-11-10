import { Document, Types } from 'mongoose';
export type SalaryRateDocument = SalaryRate & Document;
export declare class SalaryRate {
    user: Types.ObjectId;
    project?: Types.ObjectId;
    calculationType: string;
    dailyRate?: number;
    hourlyRate?: number;
    projectRate?: number;
    overtimeRatePerHour: number;
    effectiveFrom: Date;
    effectiveTo?: Date;
    isActive: boolean;
    is_deleted: boolean;
    remarks?: string;
}
export declare const SalaryRateSchema: import("mongoose").Schema<SalaryRate, import("mongoose").Model<SalaryRate, any, any, any, Document<unknown, any, SalaryRate> & SalaryRate & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SalaryRate, Document<unknown, {}, import("mongoose").FlatRecord<SalaryRate>> & import("mongoose").FlatRecord<SalaryRate> & {
    _id: Types.ObjectId;
}>;
//# sourceMappingURL=salary-rate.schema.d.ts.map