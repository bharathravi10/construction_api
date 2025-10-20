// users/user.service.ts
import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../../common/schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './user-details.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<{ message: string }> {
    try {
      // Check email or mobile conflicts
      const existingUser = await this.userModel.findOne({
        $or: [{ email: createUserDto.email }, { mobile: createUserDto.mobile }],
        is_deleted: false,
      }).exec();

      if (existingUser) {
        throw new ConflictException('Email or mobile already exists');
      }

      const createdUser = new this.userModel({...createUserDto,role:new Types.ObjectId(createUserDto.role)});
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
        .select('_id name email mobile role is_active dob profileImage address')
        .exec();
      return users;
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
        .select('_id name email mobile role is_active dob profileImage address').populate('role')
        .exec();

      if (!user) throw new NotFoundException(`User not found`);
      return user;
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

      await this.userModel.findByIdAndUpdate(id, {...updateUserDto,role:new Types.ObjectId(updateUserDto.role)}, { new: true }).exec();
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
}
