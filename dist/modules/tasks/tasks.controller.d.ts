import { CreateTaskDto, UpdateTaskDto, UpdateTaskStatusDto, AddIssueDto, UpdateIssueInTaskDto } from './tasks.dto';
import { TasksService } from './tasks.service';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(createTaskDto: CreateTaskDto): Promise<{
        message: string;
    }>;
    findAll(projectId?: string, status?: string, assignedTo?: string): Promise<any[]>;
    getTasksByProject(projectId: string): Promise<Partial<import("../../common/schemas/task.schema").Task>[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateTaskDto: UpdateTaskDto): Promise<Partial<import("../../common/schemas/task.schema").Task>>;
    updateStatus(id: string, updateStatusDto: UpdateTaskStatusDto): Promise<Partial<import("../../common/schemas/task.schema").Task>>;
    addIssue(id: string, addIssueDto: AddIssueDto): Promise<Partial<import("../../common/schemas/task.schema").Task>>;
    updateIssue(id: string, issueIndex: string, updateIssueDto: UpdateIssueInTaskDto): Promise<Partial<import("../../common/schemas/task.schema").Task>>;
    removeIssue(id: string, issueIndex: string): Promise<Partial<import("../../common/schemas/task.schema").Task>>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=tasks.controller.d.ts.map