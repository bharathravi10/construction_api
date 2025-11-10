import { Model } from 'mongoose';
import { Role, RoleDocument } from '../../common/schemas/role.schema';
import { CreateRoleDto, UpdateRoleDto } from './role.dto';
export declare class RolesService {
    private roleModel;
    private readonly logger;
    constructor(roleModel: Model<RoleDocument>);
    create(createRoleDto: CreateRoleDto): Promise<{
        message: string;
    }>;
    findAll(): Promise<Partial<Role>[]>;
    findOne(id: string): Promise<Partial<Role>>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<void>;
}
//# sourceMappingURL=role.service.d.ts.map