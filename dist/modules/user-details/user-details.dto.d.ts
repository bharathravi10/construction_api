import { Types } from 'mongoose';
export declare class CreateUserDto {
    email: string;
    password: string;
    mobile: string;
    name?: string;
    dob?: string;
    profileImage?: string;
    address?: string;
    role: Types.ObjectId;
    projects?: Types.ObjectId[];
    is_active?: boolean;
}
export declare class UpdateUserDto {
    email?: string;
    password?: string;
    mobile?: string;
    name?: string;
    dob?: string;
    profileImage?: string;
    address?: string;
    role?: Types.ObjectId;
    projects?: Types.ObjectId[];
    is_active?: boolean;
}
export declare class AssignProjectsDto {
    projectIds: Types.ObjectId[];
}
export declare class RemoveProjectDto {
    projectId: Types.ObjectId;
}
//# sourceMappingURL=user-details.dto.d.ts.map