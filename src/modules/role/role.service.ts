import { Injectable, NotFoundException, Logger, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '../../common/schemas/role.schema';
import { CreateRoleDto, UpdateRoleDto } from './role.dto';

@Injectable()
export class RolesService {
    private readonly logger = new Logger(RolesService.name);

    constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) { }

    async create(createRoleDto: CreateRoleDto): Promise<{ message: string }> {
        try {
            // Check if a role with the same name exists and is not soft-deleted
            const existingRole = await this.roleModel.findOne({
                name: createRoleDto.name,
                is_deleted: false
            }).exec();

            if (existingRole) {
                // Role exists and is not soft-deleted, check if it's active or inactive
                if (existingRole.is_active === true) {
                    throw new ConflictException(`Role with name '${createRoleDto.name}' already exists and is active`);
                } else {
                    throw new ConflictException(`Role with name '${createRoleDto.name}' already exists but is inactive`);
                }
            }

            // If a soft-deleted role with the same name exists, restore it
            const softDeletedRole = await this.roleModel.findOne({
                name: createRoleDto.name,
                is_deleted: true
            }).exec();

            if (softDeletedRole) {
                // Restore the soft-deleted role
                await this.roleModel.findByIdAndUpdate(softDeletedRole._id, {
                    ...createRoleDto,
                    is_deleted: false,
                    is_active: true
                }).exec();
                return { message: 'Role restored successfully' };
            }

            const createdRole = new this.roleModel(createRoleDto);
            await createdRole.save();
            return { message: 'Role successfully created' };
        } catch (error: unknown) {
            if (error instanceof Error) {
                this.logger.error('Failed to create role', error.stack);
                throw error; // rethrow to be caught in controller
            } else {
                this.logger.error('Failed to create role', JSON.stringify(error));
                throw new Error('Failed to create role');
            }
        }
    }


    async findAll(): Promise<Partial<Role>[]> {
        try {
            // Fetch roles where is_deleted is true and only select specific fields
            const roles = await this.roleModel
                .find({ is_deleted: false })
                .select('_id name description is_active')
                .exec();

            return roles;
        } catch (error: unknown) {
            if (error instanceof Error) {
                this.logger.error('Failed to fetch roles', error.stack);
            } else {
                this.logger.error('Failed to fetch roles', JSON.stringify(error));
            }
            throw error;
        }
    }



    async findOne(id: string): Promise<Partial<Role>> {
        try {
            // Find by ID, only select needed fields, and make sure is_deleted is false
            const role = await this.roleModel
                .findOne({ _id: id, is_deleted: false })
                .select('_id name description is_active')
                .exec();

            if (!role) {
                throw new NotFoundException(`Role with id ${id} not found`);
            }

            return role;
        } catch (error: unknown) {
            if (error instanceof Error) {
                this.logger.error(`Failed to fetch role ${id}`, error.stack);
            } else {
                this.logger.error(`Failed to fetch role ${id}`, JSON.stringify(error));
            }
            throw error;
        }
    }


    async update(id: string, updateRoleDto: UpdateRoleDto): Promise<{ message: string }> {
        try {
            // Find role first and check if it's not deleted
            const existingRole = await this.roleModel.findOne({ _id: id, is_deleted: false }).exec();
            if (!existingRole) {
                throw new NotFoundException(`Role not found`);
            }
            const conflictCheck = await this.roleModel.findOne({
                name: updateRoleDto.name,
                is_deleted: false,
                _id: { $ne: id }, // exclude the current role
            }).exec();
            if (conflictCheck) {
                throw new ConflictException(`Role name already exists`);
            }
            // Perform update
            await this.roleModel.findByIdAndUpdate(id, updateRoleDto, { new: true }).exec();

            return { message: 'Role updated successfully' };
        } catch (error: unknown) {
            if (error instanceof Error) {
                this.logger.error(`Failed to update role ${id}`, error.stack);
            } else {
                this.logger.error(`Failed to update role ${id}`, JSON.stringify(error));
            }
            throw error;
        }
    }


    async remove(id: string): Promise<void> {
        try {
            const deletedRole = await this.roleModel.findByIdAndUpdate(id, { is_deleted: true }, { new: true }).exec();
            if (!deletedRole) throw new NotFoundException(`Role with id ${id} not found`);
        } catch (error: unknown) {
            if (error instanceof Error) {
                this.logger.error(`Failed to delete role ${id}`, error.stack);
            } else {
                this.logger.error(`Failed to delete role ${id}`, JSON.stringify(error));
            }
            throw error;
        }
    }
}
