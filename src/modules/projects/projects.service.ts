import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from '../../common/schemas/projects.schema';
import { User, UserDocument } from '../../common/schemas/user.schema';
import { CreateProjectDto, UpdateProjectDto } from './projects.dto';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createProject(createDto: CreateProjectDto): Promise<{ message: string }> {
    try {
      const project = new this.projectModel(createDto);
      await project.save();
      
      this.logger.log(`Project created: ${project._id}`);
      return { message: 'Project created successfully' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Failed to create project', error.stack);
        throw error;
      } else {
        this.logger.error('Unknown error creating project', JSON.stringify(error));
        throw new Error('Failed to create project');
      }
    }
  }

  async getAllProjects(): Promise<Project[]> {
    try {
      const projects = await this.projectModel
        .find({ is_deleted: false })
        .select('-createdAt -updatedAt -__v -is_deleted')
        .sort({ createdAt: -1 })
        .exec();

      return projects;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Failed to fetch projects', error.stack);
        throw error;
      } else {
        this.logger.error('Unknown error fetching projects', JSON.stringify(error));
        throw new Error('Failed to fetch projects');
      }
    }
  }

  async getProjectById(id: string): Promise<Project> {
    try {
      const project = await this.projectModel
        .findOne({ _id: id, is_deleted: false })
        .select('-createdAt -updatedAt -__v -is_deleted')
        .exec();

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      return project;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to fetch project ${id}`, error.stack);
        throw error;
      } else {
        this.logger.error(`Unknown error fetching project ${id}`, JSON.stringify(error));
        throw new Error('Failed to fetch project');
      }
    }
  }

  async updateProject(id: string, updateDto: UpdateProjectDto): Promise<Project> {
    try {
      const project = await this.projectModel.findOneAndUpdate(
        { _id: id, is_deleted: false },
        { $set: updateDto },
        { new: true },
      ).select('-createdAt -updatedAt -__v -is_deleted').exec();

      if (!project) {
        throw new NotFoundException('Project not found or deleted');
      }

      this.logger.log(`Project updated: ${id}`);
      return project;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to update project ${id}`, error.stack);
        throw error;
      } else {
        this.logger.error(`Unknown error updating project ${id}`, JSON.stringify(error));
        throw new Error('Failed to update project');
      }
    }
  }

  // 🔥 Soft delete instead of removing record
  async softDeleteProject(id: string): Promise<{ message: string }> {
    try {
      const project = await this.projectModel.findOneAndUpdate(
        { _id: id, is_deleted: false },
        { $set: { is_deleted: true, isActive: false } },
        { new: true }
      ).exec();

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      this.logger.log(`Project soft-deleted: ${id}`);
      return { message: 'Project soft deleted successfully' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to delete project ${id}`, error.stack);
        throw error;
      } else {
        this.logger.error(`Unknown error deleting project ${id}`, JSON.stringify(error));
        throw new Error('Failed to delete project');
      }
    }
  }

  async getProjectUsers(projectId: string): Promise<User[]> {
    try {
      const users = await this.userModel
        .find({ 
          projects: projectId, 
          is_deleted: false 
        })
        .select('_id name email mobile role')
        .populate('role', 'name')
        .exec();
      
      return users;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to fetch users for project ${projectId}`, error.stack);
        throw error;
      } else {
        this.logger.error(`Unknown error fetching users for project ${projectId}`, JSON.stringify(error));
        throw new Error('Failed to fetch project users');
      }
    }
  }

  async getProjectsByUser(userId: string): Promise<Project[]> {
    try {
      const user = await this.userModel
        .findOne({ _id: userId, is_deleted: false })
        .populate('projects')
        .exec();
      
      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user.projects as Project[];
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to fetch projects for user ${userId}`, error.stack);
        throw error;
      } else {
        this.logger.error(`Unknown error fetching projects for user ${userId}`, JSON.stringify(error));
        throw new Error('Failed to fetch projects for user');
      }
    }
  }

  async getProjectTeamMembers(projectId: string): Promise<User[]> {
    try {
      const project = await this.projectModel
        .findOne({ _id: projectId, is_deleted: false })
        .exec();
      
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      const teamMembers = await this.userModel
        .find({ 
          projects: projectId, 
          is_deleted: false 
        })
        .select('_id name email mobile role')
        .populate('role', 'name')
        .exec();

      return teamMembers;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to fetch team members for project ${projectId}`, error.stack);
        throw error;
      } else {
        this.logger.error(`Unknown error fetching team members for project ${projectId}`, JSON.stringify(error));
        throw new Error('Failed to fetch project team members');
      }
    }
  }

  async getProjectClients(projectId: string): Promise<User[]> {
    try {
      const project = await this.projectModel
        .findOne({ _id: projectId, is_deleted: false })
        .exec();
      
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      const clients = await this.userModel
        .find({ 
          projects: projectId, 
          is_deleted: false 
        })
        .populate({
          path: 'role',
          match: { name: 'Client' }
        })
        .exec();

      // Filter out users who don't have Client role (defensive check - populate already filters)
      return clients.filter(user => {
        const role = user.role;
        return role && typeof role === 'object' && 'name' in role && role.name === 'Client';
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to fetch clients for project ${projectId}`, error.stack);
        throw error;
      } else {
        this.logger.error(`Unknown error fetching clients for project ${projectId}`, JSON.stringify(error));
        throw new Error('Failed to fetch project clients');
      }
    }
  }
}
