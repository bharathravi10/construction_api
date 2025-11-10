import { Model } from 'mongoose';
import { User, UserDocument } from '../../common/schemas/user.schema';
import { ProjectDocument } from '../../common/schemas/projects.schema';
import { CreateUserDto, UpdateUserDto, AssignProjectsDto, RemoveProjectDto } from './user-details.dto';
export declare class UsersService {
    private userModel;
    private projectModel;
    private readonly logger;
    constructor(userModel: Model<UserDocument>, projectModel: Model<ProjectDocument>);
    create(createUserDto: CreateUserDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<Partial<User>[]>;
    findOne(id: string): Promise<Partial<User>>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    assignProjects(userId: string, assignProjectsDto: AssignProjectsDto): Promise<{
        message: string;
    }>;
    removeProject(userId: string, removeProjectDto: RemoveProjectDto): Promise<{
        message: string;
    }>;
    getUserProjects(userId: string): Promise<Partial<User>>;
}
//# sourceMappingURL=user-details.service.d.ts.map