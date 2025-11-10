import { Document, Types } from 'mongoose';
export type AttendanceDocument = Attendance & Document;
export declare class Attendance {
    user: Types.ObjectId;
    date: Date;
    status: string;
    checkIn?: Date;
    checkOut?: Date;
    overtime: number;
    remarks?: string;
    is_deleted: boolean;
}
export declare const AttendanceSchema: import("mongoose").Schema<Attendance, import("mongoose").Model<Attendance, any, any, any, Document<unknown, any, Attendance> & Attendance & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Attendance, Document<unknown, {}, import("mongoose").FlatRecord<Attendance>> & import("mongoose").FlatRecord<Attendance> & {
    _id: Types.ObjectId;
}>;
//# sourceMappingURL=attendance.schema.d.ts.map