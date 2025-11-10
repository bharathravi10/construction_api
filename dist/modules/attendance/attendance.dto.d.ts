import { Types } from 'mongoose';
export declare class CreateAttendanceDto {
    readonly user: Types.ObjectId;
    readonly date: Date;
    readonly status: string;
    readonly checkIn?: Date;
    readonly checkOut?: Date;
    readonly overtime?: number;
    readonly remarks?: string;
}
export declare class UpdateAttendanceDto {
    readonly status?: string;
    readonly checkIn?: Date;
    readonly checkOut?: Date;
    readonly overtime?: number;
    readonly remarks?: string;
}
//# sourceMappingURL=attendance.dto.d.ts.map