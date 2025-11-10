import { Document, Types } from 'mongoose';
import { RoleDocument } from './role.schema';
import { ProjectDocument } from './projects.schema';
export type UserDocument = User & Document;
export declare class User {
    email: string;
    password: string;
    role: Types.ObjectId | RoleDocument;
    projects: Types.ObjectId[] | ProjectDocument[];
    mobile: string;
    dob?: string;
    profileImage?: string;
    address?: string;
    name?: string;
    is_active: boolean;
    is_deleted: boolean;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
}>;
//# sourceMappingURL=user.schema.d.ts.map