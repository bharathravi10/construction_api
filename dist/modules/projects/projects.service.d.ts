import { Model } from 'mongoose';
import { Project, ProjectDocument } from '../../common/schemas/projects.schema';
import { User, UserDocument } from '../../common/schemas/user.schema';
import { CreateProjectDto, UpdateProjectDto } from './projects.dto';
export declare class ProjectService {
    private readonly projectModel;
    private readonly userModel;
    private readonly logger;
    constructor(projectModel: Model<ProjectDocument>, userModel: Model<UserDocument>);
    createProject(createDto: CreateProjectDto): Promise<{
        message: string;
    }>;
    getAllProjects(): Promise<Project[]>;
    getProjectById(id: string): Promise<Project>;
    updateProject(id: string, updateDto: UpdateProjectDto): Promise<Project>;
    softDeleteProject(id: string): Promise<{
        message: string;
    }>;
    getProjectUsers(projectId: string): Promise<User[]>;
    getProjectsByUser(userId: string): Promise<Project[]>;
    getProjectTeamMembers(projectId: string): Promise<User[]>;
    getProjectClients(projectId: string): Promise<User[]>;
}
//# sourceMappingURL=projects.service.d.ts.map