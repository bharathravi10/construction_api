import { Document, Types } from 'mongoose';
export type RoleDocument = Role & Document;
export declare class Role {
    _id?: Types.ObjectId;
    name: string;
    description?: string;
    is_deleted?: boolean;
    is_active?: boolean;
}
export declare const RoleSchema: import("mongoose").Schema<Role, import("mongoose").Model<Role, any, any, any, Document<unknown, any, Role> & Role & Required<{
    _id: Types.ObjectId;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Role, Document<unknown, {}, import("mongoose").FlatRecord<Role>> & import("mongoose").FlatRecord<Role> & Required<{
    _id: Types.ObjectId;
}>>;
//# sourceMappingURL=role.schema.d.ts.map