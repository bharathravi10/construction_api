import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UserDocument } from '../../common/schemas/user.schema';
import { LoginDto } from './auth.dto';
export declare class AuthService {
    private readonly userModel;
    private readonly jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    validateUser(identifier: string, password: string): Promise<UserDocument | null>;
    getTokens(user: UserDocument): {
        accessToken: string;
        refreshToken: string;
    };
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        message: string;
        user: any;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        message: string;
        user: {
            email: string;
            role: import("mongoose").Types.ObjectId | import("../../common/schemas/role.schema").RoleDocument;
            projects: import("mongoose").Types.ObjectId[] | import("../../common/schemas/projects.schema").ProjectDocument[];
            mobile: string;
            dob?: string;
            profileImage?: string;
            address?: string;
            name?: string;
            is_active: boolean;
            is_deleted: boolean;
            _id: any;
            __v?: any;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            id?: any;
            isNew: boolean;
            schema: import("mongoose").Schema;
        };
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map