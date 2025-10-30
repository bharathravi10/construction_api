import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from '../../common/schemas/projects.schema';
import { User, UserDocument } from '../../common/schemas/user.schema';
import { CreateProjectDto, UpdateProjectDto } from './projects.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createProject(createDto: CreateProjectDto): Promise<{ message: string }> {
    const project = new this.projectModel(createDto);
    await project.save();
    return { message: 'Project created successfully' };
  }

  async getAllProjects(): Promise<Project[]> {
    return this.projectModel
      .find({ is_deleted: false })
      .select('-createdAt -updatedAt -__v')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getProjectById(id: string): Promise<Project> {
    const project = await this.projectModel
      .findOne({ _id: id, is_deleted: false })
      .select('-createdAt -updatedAt -__v')
      .exec();
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async updateProject(id: string, updateDto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectModel.findOneAndUpdate(
      { _id: id, is_deleted: false },
      { $set: updateDto },
      { new: true },
    ).select('-createdAt -updatedAt -__v').exec();
    if (!project) throw new NotFoundException('Project not found or deleted');
    return project;
  }

  // 🔥 Soft delete instead of removing record
  async softDeleteProject(id: string): Promise<{ message: string }> {
    const project = await this.projectModel.findByIdAndUpdate(
      id,
      { $set: { is_deleted: true, isActive: false } },
      { new: true },
    );
    if (!project) throw new NotFoundException('Project not found');
    return { message: 'Project soft deleted successfully' };
  }

  async getProjectUsers(projectId: string): Promise<User[]> {
    const users = await this.userModel
      .find({ 
        projects: projectId, 
        is_deleted: false 
      })
      .select('_id name email mobile role')
      .populate('role', 'name')
      .exec();
    
    return users;
  }

  async getProjectsByUser(userId: string): Promise<Project[]> {
    const user = await this.userModel
      .findOne({ _id: userId, is_deleted: false })
      .populate('projects')
      .exec();
    
    if (!user) throw new NotFoundException('User not found');
    return user.projects as Project[];
  }

  async getProjectTeamMembers(projectId: string): Promise<User[]> {
    const project = await this.projectModel
      .findOne({ _id: projectId, is_deleted: false })
      .exec();
    
    if (!project) throw new NotFoundException('Project not found');

    const teamMembers = await this.userModel
      .find({ 
        projects: projectId, 
        is_deleted: false 
      })
      .select('_id name email mobile role')
      .populate('role', 'name')
      .exec();

    return teamMembers;
  }

  async getProjectClients(projectId: string): Promise<User[]> {
    const project = await this.projectModel
      .findOne({ _id: projectId, is_deleted: false })
      .exec();
    
    if (!project) throw new NotFoundException('Project not found');

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

    // Filter out users who don't have Client role
    return clients.filter(user => user.role && (user.role as any).name === 'Client');
  }
}
