import { Types } from 'mongoose';
export declare class CreateSalaryRateDto {
    readonly user: Types.ObjectId;
    readonly project?: Types.ObjectId;
    readonly calculationType: string;
    readonly dailyRate?: number;
    readonly hourlyRate?: number;
    readonly projectRate?: number;
    readonly overtimeRatePerHour?: number;
    readonly effectiveFrom?: Date;
    readonly effectiveTo?: Date;
    readonly remarks?: string;
}
export declare class UpdateSalaryRateDto {
    readonly project?: Types.ObjectId;
    readonly calculationType?: string;
    readonly dailyRate?: number;
    readonly hourlyRate?: number;
    readonly projectRate?: number;
    readonly overtimeRatePerHour?: number;
    readonly effectiveFrom?: Date;
    readonly effectiveTo?: Date;
    readonly isActive?: boolean;
    readonly remarks?: string;
}
export declare class CalculateSalaryDto {
    readonly user: Types.ObjectId;
    readonly project?: Types.ObjectId;
    readonly periodType: string;
    readonly periodStart: Date;
    readonly periodEnd: Date;
    readonly forceRecalculate?: boolean;
}
export declare class GetSalaryCalculationDto {
    readonly userId?: Types.ObjectId;
    readonly projectId?: Types.ObjectId;
    readonly periodType?: string;
    readonly startDate?: string;
    readonly endDate?: string;
    readonly status?: string;
}
//# sourceMappingURL=salary.dto.d.ts.map