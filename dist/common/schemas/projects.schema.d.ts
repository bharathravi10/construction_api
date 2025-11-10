import { Document, Types } from 'mongoose';
export type ProjectDocument = Project & Document;
export declare class Project {
    name: string;
    description?: string;
    address: string;
    state: string;
    plannedStartDate: Date;
    plannedEndDate: Date;
    actualStartDate?: Date;
    actualEndDate?: Date;
    status: string;
    estimatedBudget: number;
    totalPriceValue: number;
    totalEarnedValue: number;
    progressPercentage: number;
    documents: string[];
    remarks?: string;
    isActive: boolean;
    is_deleted: boolean;
}
export declare const ProjectSchema: import("mongoose").Schema<Project, import("mongoose").Model<Project, any, any, any, Document<unknown, any, Project> & Project & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Project, Document<unknown, {}, import("mongoose").FlatRecord<Project>> & import("mongoose").FlatRecord<Project> & {
    _id: Types.ObjectId;
}>;
//# sourceMappingURL=projects.schema.d.ts.map