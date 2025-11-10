import { CreateUserDto, UpdateUserDto, AssignProjectsDto, RemoveProjectDto } from './user-details.dto';
import { UsersService } from './user-details.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<Partial<import("../../common/schemas/user.schema").User>[]>;
    findOne(id: string): Promise<Partial<import("../../common/schemas/user.schema").User>>;
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
}
//# sourceMappingURL=user-details.controller.d.ts.map