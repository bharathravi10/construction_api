import { Document, Types, Schema as MongooseSchema } from 'mongoose';
export type TaskDocument = Task & Document;
export interface Issue {
    title: string;
    description?: string;
    severity?: string;
    status?: string;
    reportedDate?: Date;
    resolvedDate?: Date;
    reportedBy?: string;
    resolvedBy?: string;
    remarks?: string;
}
export declare class Task {
    name: string;
    description?: string;
    project: Types.ObjectId;
    startDate: Date;
    endDate: Date;
    actualStartDate?: Date;
    actualEndDate?: Date;
    status: string;
    issues: Issue[];
    progressPercentage: number;
    assignedUsers: Types.ObjectId[];
    remarks?: string;
    documents: string[];
    isActive: boolean;
    is_deleted: boolean;
}
export declare const TaskSchema: MongooseSchema<Task, import("mongoose").Model<Task, any, any, any, Document<unknown, any, Task> & Task & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Task, Document<unknown, {}, import("mongoose").FlatRecord<Task>> & import("mongoose").FlatRecord<Task> & {
    _id: Types.ObjectId;
}>;
//# sourceMappingURL=task.schema.d.ts.map