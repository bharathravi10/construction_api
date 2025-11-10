import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto } from './auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        message: string;
        user: any;
    }>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<{
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
//# sourceMappingURL=auth.controller.d.ts.map