import { CreateProjectDto, UpdateProjectDto } from './projects.dto';
import { ProjectService } from './projects.service';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    create(createDto: CreateProjectDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("../../common/schemas/projects.schema").Project[]>;
    findOne(id: string): Promise<import("../../common/schemas/projects.schema").Project>;
    update(id: string, updateDto: UpdateProjectDto): Promise<import("../../common/schemas/projects.schema").Project>;
    softDelete(id: string): Promise<{
        message: string;
    }>;
    getProjectUsers(projectId: string): Promise<import("../../common/schemas/user.schema").User[]>;
    getProjectsByUser(userId: string): Promise<import("../../common/schemas/projects.schema").Project[]>;
    getProjectTeamMembers(projectId: string): Promise<import("../../common/schemas/user.schema").User[]>;
    getProjectClients(projectId: string): Promise<import("../../common/schemas/user.schema").User[]>;
}
//# sourceMappingURL=projects.controller.d.ts.map