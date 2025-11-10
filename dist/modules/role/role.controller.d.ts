import { RolesService } from './role.service';
import { Role } from '../../common/schemas/role.schema';
import { CreateRoleDto, UpdateRoleDto } from './role.dto';
export declare class RolesController {
    private readonly rolesService;
    private readonly logger;
    constructor(rolesService: RolesService);
    create(createRoleDto: CreateRoleDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<Partial<Role>[]>;
    findOne(id: string): Promise<Partial<Role>>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=role.controller.d.ts.map