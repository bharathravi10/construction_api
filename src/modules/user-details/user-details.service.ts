// users/user.service.ts
import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../../common/schemas/user.schema';
import { Project, ProjectDocument } from '../../common/schemas/projects.schema';
import { CreateUserDto, UpdateUserDto, AssignProjectsDto, RemoveProjectDto } from './user-details.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ message: string }> {
    try {
      // Check if soft-deleted user exists with same email or mobile
      const softDeletedUser = await this.userModel.findOne({
        $or: [{ email: createUserDto.email }, { mobile: createUserDto.mobile }],
        is_deleted: true,
      }).exec();

      if (softDeletedUser) {
        // Restore the soft-deleted user with new data
        const userData: any = {
          ...createUserDto,
          role: new Types.ObjectId(createUserDto.role),
          projects: createUserDto.projects ? createUserDto.projects.map(id => new Types.ObjectId(id)) : [],
          is_deleted: false,
          is_active: true
        };
        
        // Update the document (password will be hashed by pre-save hook)
        Object.assign(softDeletedUser, userData);
        await softDeletedUser.save();
        
        return { message: 'User restored successfully' };
      }

      // Check if active user exists with same email or mobile
      const existingUser = await this.userModel.findOne({
        $or: [{ email: createUserDto.email }, { mobile: createUserDto.mobile }],
        is_deleted: false,
      }).exec();

      if (existingUser) {
        throw new ConflictException('Email or mobile already exists');
      }

      // Create new user
      const userData = {
        ...createUserDto,
        role: new Types.ObjectId(createUserDto.role),
        projects: createUserDto.projects ? createUserDto.projects.map(id => new Types.ObjectId(id)) : []
      };
      const createdUser = new this.userModel(userData);
      await createdUser.save();
      return { message: 'User successfully created' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Failed to create user', error.stack);
        throw error;
      } else {
        this.logger.error('Unknown error while creating user', JSON.stringify(error));
        throw new Error('Failed to create user');
      }
    }
  }

  async findAll(): Promise<Partial<User>[]> {
    try {
      const users = await this.userModel
        .find({ is_deleted: false })
        .select('_id name email mobile role projects is_active dob profileImage address')
        .populate({
          path: 'role',
          select: '_id name description'
        })
        .exec();

      // Manually populate projects
      const usersWithProjects = await Promise.all(
        users.map(async (user) => {
          if (user.projects && user.projects.length > 0) {
            const projectIds = user.projects.map(p => p.toString());
            const projects = await this.projectModel
              .find({ _id: { $in: projectIds }, is_deleted: false })
              .select('_id name description address state status estimatedBudget')
              .exec();
            return { ...user.toObject(), projects };
          }
          return user.toObject();
        })
      );

      return usersWithProjects;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Failed to fetch users', error.stack);
      } else {
        this.logger.error('Unknown error fetching users', JSON.stringify(error));
      }
      throw error;
    }
  }

  async findOne(id: string): Promise<Partial<User>> {
    try {
      const user = await this.userModel
        .findOne({ _id: id, is_deleted: false })
        .select('_id name email mobile role projects is_active dob profileImage address')
        .populate({
          path: 'role',
          select: '_id name description'
        })
        .exec();

      if (!user) throw new NotFoundException(`User not found`);

      // Manually populate projects
      let projects: any[] = [];
      if (user.projects && user.projects.length > 0) {
        const projectIds = user.projects.map(p => p.toString());
        projects = await this.projectModel
          .find({ _id: { $in: projectIds }, is_deleted: false })
          .select('_id name description address state status estimatedBudget')
          .exec();
      }

      return { ...user.toObject(), projects } as any;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to fetch user ${id}`, error.stack);
      } else {
        this.logger.error(`Unknown error fetching user ${id}`, JSON.stringify(error));
      }
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<{ message: string }> {
    try {
      const existingUser = await this.userModel.findOne({ _id: id, is_deleted: false }).exec();
      if (!existingUser) throw new NotFoundException(`User not found`);

      // Check for email/mobile conflict with other users
      if (updateUserDto.email || updateUserDto.mobile) {
        const conflictCheck = await this.userModel.findOne({
          $or: [
            { email: updateUserDto.email },
            { mobile: updateUserDto.mobile }
          ],
          _id: { $ne: id },
          is_deleted: false
        }).exec();

        if (conflictCheck) throw new ConflictException('Email or mobile already exists');
      }

      const updateData = {
        ...updateUserDto,
        role: updateUserDto.role ? new Types.ObjectId(updateUserDto.role) : undefined,
        projects: updateUserDto.projects ? updateUserDto.projects.map(id => new Types.ObjectId(id)) : undefined
      };
      await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
      this.logger.log(`User updated: ${id}`);
      return { message: 'User successfully updated' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to update user ${id}`, error.stack);
        throw error;
      } else {
        this.logger.error(`Unknown error updating user ${id}`, JSON.stringify(error));
        throw new Error('Failed to update user');
      }
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const user = await this.userModel.findOne({ _id: id, is_deleted: false }).exec();
      if (!user) throw new NotFoundException(`User with id ${id} not found`);

      user.is_deleted = true;
      await user.save();
      this.logger.log(`User soft-deleted: ${id}`);
      return { message: 'User successfully deleted' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to delete user ${id}`, error.stack);
        throw error;
      } else {
        this.logger.error(`Unknown error deleting user ${id}`, JSON.stringify(error));
        throw new Error('Failed to delete user');
      }
    }
  }

  async assignProjects(userId: string, assignProjectsDto: AssignProjectsDto): Promise<{ message: string }> {
    try {
      const user = await this.userModel.findOne({ _id: userId, is_deleted: false }).exec();
      if (!user) throw new NotFoundException(`User not found`);

      // Convert string IDs to ObjectIds
      const projectIds = assignProjectsDto.projectIds.map(id => new Types.ObjectId(id));
      
      // Add new projects to existing ones (avoid duplicates)
      const existingProjects = user.projects || [];
      const newProjects = [...new Set([...existingProjects.map(p => p.toString()), ...projectIds.map(p => p.toString())])];
      
      // Update the user with ObjectIds
      user.projects = newProjects.map(id => new Types.ObjectId(id));
      await user.save();
      
      this.logger.log(`Projects assigned to user: ${userId}`);
      return { message: 'Projects successfully assigned to user' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to assign projects to user ${userId}`, error.stack);
        throw error;
      } else {
        this.logger.error(`Unknown error assigning projects to user ${userId}`, JSON.stringify(error));
        throw new Error('Failed to assign projects to user');
      }
    }
  }

  async removeProject(userId: string, removeProjectDto: RemoveProjectDto): Promise<{ message: string }> {
    try {
      const user = await this.userModel.findOne({ _id: userId, is_deleted: false }).exec();
      if (!user) throw new NotFoundException(`User not found`);

      const projectId = new Types.ObjectId(removeProjectDto.projectId);
      const existingProjects = user.projects || [];
      
      // Remove the project from the array
      const updatedProjects = existingProjects.filter(p => p.toString() !== projectId.toString());
      
      await this.userModel.findByIdAndUpdate(
        userId, 
        { projects: updatedProjects }, 
        { new: true }
      ).exec();
      
      this.logger.log(`Project removed from user: ${userId}`);
      return { message: 'Project successfully removed from user' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to remove project from user ${userId}`, error.stack);
        throw error;
      } else {
        this.logger.error(`Unknown error removing project from user ${userId}`, JSON.stringify(error));
        throw new Error('Failed to remove project from user');
      }
    }
  }

  async getUserProjects(userId: string): Promise<Partial<User>> {
    try {
      const user = await this.userModel
        .findOne({ _id: userId, is_deleted: false })
        .select('_id name email projects')
        .populate({
          path: 'projects',
          select: '-createdAt -updatedAt -__v -is_deleted'
        })
        .exec();

      if (!user) throw new NotFoundException(`User not found`);
      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to fetch user projects ${userId}`, error.stack);
        throw error;
      } else {
        this.logger.error(`Unknown error fetching user projects ${userId}`, JSON.stringify(error));
        throw new Error('Failed to fetch user projects');
      }
    }
  }
}