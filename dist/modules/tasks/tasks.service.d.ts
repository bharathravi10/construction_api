import { Model } from 'mongoose';
import { Task, TaskDocument } from '../../common/schemas/task.schema';
import { ProjectDocument } from '../../common/schemas/projects.schema';
import { UserDocument } from '../../common/schemas/user.schema';
import { CreateTaskDto, UpdateTaskDto, UpdateTaskStatusDto, AddIssueDto, UpdateIssueInTaskDto } from './tasks.dto';
export declare class TasksService {
    private readonly taskModel;
    private readonly projectModel;
    private readonly userModel;
    private readonly logger;
    constructor(taskModel: Model<TaskDocument>, projectModel: Model<ProjectDocument>, userModel: Model<UserDocument>);
    private handleError;
    private validateProject;
    private validateUser;
    private validateUsers;
    private validateUsersAssignedToProject;
    private validateDateRange;
    private findTaskById;
    private populateTaskDetails;
    private populateTasksDetails;
    private prepareTaskData;
    create(createTaskDto: CreateTaskDto): Promise<{
        message: string;
    }>;
    findAll(filters?: {
        projectId?: string;
        status?: string;
        assignedTo?: string;
    }): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateTaskDto: UpdateTaskDto): Promise<Partial<Task>>;
    softDelete(id: string): Promise<{
        message: string;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
    updateStatus(id: string, updateStatusDto: UpdateTaskStatusDto): Promise<Partial<Task>>;
    addIssue(id: string, addIssueDto: AddIssueDto): Promise<Partial<Task>>;
    updateIssue(id: string, updateIssueDto: UpdateIssueInTaskDto): Promise<Partial<Task>>;
    removeIssue(id: string, issueIndex: number): Promise<Partial<Task>>;
    getTasksByProject(projectId: string): Promise<Partial<Task>[]>;
}
//# sourceMappingURL=tasks.service.d.ts.map