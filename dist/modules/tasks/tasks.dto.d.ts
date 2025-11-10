import { Types } from 'mongoose';
export declare class CreateIssueDto {
    readonly title: string;
    readonly description?: string;
    readonly severity?: string;
    readonly status?: string;
    readonly reportedDate?: Date;
    readonly reportedBy?: string;
    readonly remarks?: string;
}
export declare class UpdateIssueDto {
    readonly title?: string;
    readonly description?: string;
    readonly severity?: string;
    readonly status?: string;
    readonly resolvedDate?: Date;
    readonly resolvedBy?: string;
    readonly remarks?: string;
}
export declare class CreateTaskDto {
    readonly name: string;
    readonly description?: string;
    readonly project: Types.ObjectId;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly actualStartDate?: Date;
    readonly actualEndDate?: Date;
    readonly status?: string;
    readonly progressPercentage?: number;
    readonly assignedUsers?: Types.ObjectId[];
    readonly remarks?: string;
    readonly documents?: string[];
    readonly issues?: CreateIssueDto[];
    readonly isActive?: boolean;
}
export declare class UpdateTaskDto {
    readonly name?: string;
    readonly description?: string;
    readonly project?: Types.ObjectId;
    readonly startDate?: Date;
    readonly endDate?: Date;
    readonly actualStartDate?: Date;
    readonly actualEndDate?: Date;
    readonly status?: string;
    readonly progressPercentage?: number;
    readonly assignedUsers?: Types.ObjectId[];
    readonly remarks?: string;
    readonly documents?: string[];
    readonly isActive?: boolean;
}
export declare class UpdateTaskStatusDto {
    readonly status: string;
    readonly actualStartDate?: Date;
    readonly actualEndDate?: Date;
}
export declare class AddIssueDto {
    readonly issue: CreateIssueDto;
}
export declare class UpdateIssueInTaskDto {
    readonly issueIndex: number;
    readonly issue: UpdateIssueDto;
}
//# sourceMappingURL=tasks.dto.d.ts.map