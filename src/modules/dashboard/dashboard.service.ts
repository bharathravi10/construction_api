import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Project, ProjectDocument } from '../../common/schemas/projects.schema';
import { User, UserDocument } from '../../common/schemas/user.schema';
import { Attendance, AttendanceDocument } from '../../common/schemas/attendance.schema';
import { SalaryCalculation, SalaryCalculationDocument } from '../../common/schemas/salary-calculation.schema';
import { Material, MaterialDocument } from '../../common/schemas/material.schema';
import { Task, TaskDocument } from '../../common/schemas/task.schema';
import { DashboardQueryDto, PeriodType } from './dashboard.dto';
import { Types } from 'mongoose';

interface DateRange {
  start: Date;
  end: Date;
}

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Attendance.name) private readonly attendanceModel: Model<AttendanceDocument>,
    @InjectModel(SalaryCalculation.name) private readonly salaryCalculationModel: Model<SalaryCalculationDocument>,
    @InjectModel(Material.name) private readonly materialModel: Model<MaterialDocument>,
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  /**
   * Get date range based on period type - optimized with caching
   */
  private getDateRange(periodType: PeriodType, startDate?: string, endDate?: string): DateRange {
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    const now = new Date();
    let start: Date;
    let end: Date;

    switch (periodType) {
      case PeriodType.DAY:
        start = new Date(now);
        start.setHours(0, 0, 0, 0);
        end = new Date(now);
        end.setHours(23, 59, 59, 999);
        break;

      case PeriodType.WEEK:
        start = new Date(now);
        const dayOfWeek = start.getDay();
        const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Monday
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;

      case PeriodType.MONTH:
      default:
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
    }

    return { start, end };
  }

  /**
   * Build base filter with common conditions
   */
  private buildBaseFilter(query: DashboardQueryDto, dateRange?: DateRange): {
    projectFilter: FilterQuery<ProjectDocument>;
    userFilter: FilterQuery<UserDocument>;
    attendanceFilter: FilterQuery<AttendanceDocument>;
    salaryFilter: FilterQuery<SalaryCalculationDocument>;
    materialFilter: FilterQuery<MaterialDocument>;
    taskFilter: FilterQuery<TaskDocument>;
  } {
    const projectFilter: FilterQuery<ProjectDocument> = { is_deleted: false };
    const userFilter: FilterQuery<UserDocument> = { is_deleted: false };
    const attendanceFilter: FilterQuery<AttendanceDocument> = { is_deleted: false };
    const salaryFilter: FilterQuery<SalaryCalculationDocument> = { is_deleted: false };
    const materialFilter: FilterQuery<MaterialDocument> = { is_deleted: false };
    const taskFilter: FilterQuery<TaskDocument> = { is_deleted: false };

    if (query.projectId) {
      const projectId = new Types.ObjectId(query.projectId.toString());
      projectFilter._id = projectId;
      materialFilter.project = projectId;
      taskFilter.project = projectId;
      salaryFilter.project = projectId;
    }

    if (query.userId) {
      const userId = new Types.ObjectId(query.userId.toString());
      userFilter._id = userId;
      attendanceFilter.user = userId;
      salaryFilter.user = userId;
    }

    if (dateRange) {
      attendanceFilter.date = { $gte: dateRange.start, $lte: dateRange.end };
      salaryFilter.$and = [
        { periodStart: { $lte: dateRange.end } },
        { periodEnd: { $gte: dateRange.start } },
      ];
    }

    return {
      projectFilter,
      userFilter,
      attendanceFilter,
      salaryFilter,
      materialFilter,
      taskFilter,
    };
  }

  /**
   * Centralized error handler
   */
  private handleError(error: unknown, context: string): never {
    if (error instanceof Error) {
      this.logger.error(`Failed to ${context}`, error.stack);
      throw error;
    }
    throw new Error(`Failed to ${context}`);
  }

  /**
   * Get Projects Analytics - Optimized with combined aggregations
   */
  async getProjectsAnalytics(query: DashboardQueryDto) {
    try {
      const dateRange = this.getDateRange(
        query.periodType || PeriodType.MONTH,
        query.startDate,
        query.endDate,
      );
      const { projectFilter } = this.buildBaseFilter(query, dateRange);

      // Single aggregation pipeline for all project analytics
      const [projectsData] = await this.projectModel.aggregate([
        { $match: projectFilter },
        {
          $facet: {
            // Total and active projects
            counts: [
              {
                $group: {
                  _id: null,
                  totalProjects: { $sum: 1 },
                  activeProjects: {
                    $sum: { $cond: [{ $eq: ['$status', 'Ongoing'] }, 1, 0] },
                  },
                },
              },
            ],
            // Projects by status
            byStatus: [
              {
                $group: {
                  _id: '$status',
                  count: { $sum: 1 },
                  totalBudget: { $sum: '$estimatedBudget' },
                  totalEarned: { $sum: '$totalEarnedValue' },
                },
              },
            ],
            // Budget statistics
            budgetStats: [
              {
                $group: {
                  _id: null,
                  totalEstimatedBudget: { $sum: '$estimatedBudget' },
                  totalActualSpending: { $sum: '$totalPriceValue' },
                  totalEarnedValue: { $sum: '$totalEarnedValue' },
                  avgProgress: { $avg: '$progressPercentage' },
                },
              },
            ],
            // Projects created in period
            createdInPeriod: [
              {
                $match: {
                  createdAt: { $gte: dateRange.start, $lte: dateRange.end },
                },
              },
              { $count: 'count' },
            ],
          },
        },
      ]);

      const counts = projectsData.counts[0] || { totalProjects: 0, activeProjects: 0 };
      const budgetStats = projectsData.budgetStats[0] || {
        totalEstimatedBudget: 0,
        totalActualSpending: 0,
        totalEarnedValue: 0,
        avgProgress: 0,
      };

      return {
        totalProjects: counts.totalProjects,
        activeProjects: counts.activeProjects,
        projectsCreated: projectsData.createdInPeriod[0]?.count || 0,
        projectsByStatus: projectsData.byStatus.map((item: any) => ({
          status: item._id,
          count: item.count,
          totalBudget: item.totalBudget || 0,
          totalEarned: item.totalEarned || 0,
        })),
        budgetStats,
      };
    } catch (error: unknown) {
      this.handleError(error, 'get projects analytics');
    }
  }

  /**
   * Get Attendance Analytics - Optimized with single aggregation
   */
  async getAttendanceAnalytics(query: DashboardQueryDto) {
    try {
      const dateRange = this.getDateRange(
        query.periodType || PeriodType.MONTH,
        query.startDate,
        query.endDate,
      );
      const { attendanceFilter } = this.buildBaseFilter(query, dateRange);

      // Single aggregation pipeline for all attendance analytics
      const [attendanceData] = await this.attendanceModel.aggregate([
        { $match: attendanceFilter },
        {
          $facet: {
            // Summary statistics
            summary: [
              {
                $group: {
                  _id: null,
                  totalRecords: { $sum: 1 },
                  presentCount: {
                    $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] },
                  },
                  absentCount: {
                    $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] },
                  },
                  halfdayCount: {
                    $sum: { $cond: [{ $eq: ['$status', 'halfday'] }, 1, 0] },
                  },
                  totalOvertimeMinutes: { $sum: '$overtime' },
                },
              },
            ],
            // By status
            byStatus: [
              {
                $group: {
                  _id: '$status',
                  count: { $sum: 1 },
                  totalOvertime: { $sum: '$overtime' },
                },
              },
            ],
            // Unique users
            uniqueUsers: [{ $group: { _id: '$user' } }, { $count: 'count' }],
            // Daily breakdown
            dailyBreakdown: [
              {
                $group: {
                  _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                  present: {
                    $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] },
                  },
                  absent: {
                    $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] },
                  },
                  halfday: {
                    $sum: { $cond: [{ $eq: ['$status', 'halfday'] }, 1, 0] },
                  },
                  totalOvertime: { $sum: '$overtime' },
                },
              },
              { $sort: { _id: 1 } },
            ],
          },
        },
      ]);

      const summary = attendanceData.summary[0] || {
        totalRecords: 0,
        presentCount: 0,
        absentCount: 0,
        halfdayCount: 0,
        totalOvertimeMinutes: 0,
      };

      const attendanceRate =
        summary.totalRecords > 0
          ? ((summary.presentCount + summary.halfdayCount * 0.5) / summary.totalRecords) * 100
          : 0;

      return {
        totalRecords: summary.totalRecords,
        uniqueUsers: attendanceData.uniqueUsers[0]?.count || 0,
        presentCount: summary.presentCount,
        absentCount: summary.absentCount,
        halfdayCount: summary.halfdayCount,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
        totalOvertimeMinutes: summary.totalOvertimeMinutes,
        totalOvertimeHours: Math.round((summary.totalOvertimeMinutes / 60) * 100) / 100,
        attendanceByStatus: attendanceData.byStatus.map((item: any) => ({
          status: item._id,
          count: item.count,
          totalOvertimeMinutes: item.totalOvertime || 0,
        })),
        dailyBreakdown: attendanceData.dailyBreakdown,
      };
    } catch (error: unknown) {
      this.handleError(error, 'get attendance analytics');
    }
  }

  /**
   * Get Salary Analytics - Optimized with single aggregation
   */
  async getSalaryAnalytics(query: DashboardQueryDto) {
    try {
      const dateRange = this.getDateRange(
        query.periodType || PeriodType.MONTH,
        query.startDate,
        query.endDate,
      );
      const { salaryFilter } = this.buildBaseFilter(query, dateRange);

      // Single aggregation pipeline for all salary analytics
      const [salaryData] = await this.salaryCalculationModel.aggregate([
        { $match: salaryFilter },
        {
          $facet: {
            // Summary statistics
            summary: [
              {
                $group: {
                  _id: null,
                  totalSalary: { $sum: '$totalSalary' },
                  totalBaseSalary: { $sum: '$baseSalary' },
                  totalOvertimeSalary: { $sum: '$overtimeSalary' },
                  totalHalfDaySalary: { $sum: '$halfDaySalary' },
                  totalRecords: { $sum: 1 },
                  avgSalary: { $avg: '$totalSalary' },
                },
              },
            ],
            // By status
            byStatus: [
              {
                $group: {
                  _id: '$status',
                  count: { $sum: 1 },
                  totalSalary: { $sum: '$totalSalary' },
                },
              },
            ],
            // By calculation type
            byCalculationType: [
              {
                $group: {
                  _id: '$calculationType',
                  count: { $sum: 1 },
                  totalSalary: { $sum: '$totalSalary' },
                },
              },
            ],
            // Unique users
            uniqueUsers: [{ $group: { _id: '$user' } }, { $count: 'count' }],
            // Period breakdown
            periodBreakdown: [
              {
                $group: {
                  _id: { $dateToString: { format: '%Y-%m-%d', date: '$periodStart' } },
                  totalSalary: { $sum: '$totalSalary' },
                  count: { $sum: 1 },
                },
              },
              { $sort: { _id: 1 } },
            ],
          },
        },
      ]);

      const summary = salaryData.summary[0] || {
        totalSalary: 0,
        totalBaseSalary: 0,
        totalOvertimeSalary: 0,
        totalHalfDaySalary: 0,
        totalRecords: 0,
        avgSalary: 0,
      };

      return {
        totalSalary: summary.totalSalary,
        totalBaseSalary: summary.totalBaseSalary,
        totalOvertimeSalary: summary.totalOvertimeSalary,
        totalHalfDaySalary: summary.totalHalfDaySalary,
        totalRecords: summary.totalRecords,
        avgSalary: summary.avgSalary,
        uniqueUsers: salaryData.uniqueUsers[0]?.count || 0,
        salaryByStatus: salaryData.byStatus.map((item: any) => ({
          status: item._id,
          count: item.count,
          totalSalary: item.totalSalary || 0,
        })),
        salaryByCalculationType: salaryData.byCalculationType.map((item: any) => ({
          calculationType: item._id,
          count: item.count,
          totalSalary: item.totalSalary || 0,
        })),
        periodBreakdown: salaryData.periodBreakdown,
      };
    } catch (error: unknown) {
      this.handleError(error, 'get salary analytics');
    }
  }

  /**
   * Get Materials Analytics - Optimized with single aggregation
   */
  async getMaterialsAnalytics(query: DashboardQueryDto) {
    try {
      const dateRange = this.getDateRange(
        query.periodType || PeriodType.MONTH,
        query.startDate,
        query.endDate,
      );
      const { materialFilter } = this.buildBaseFilter(query, dateRange);

      // Single aggregation pipeline for all materials analytics
      const [materialsData] = await this.materialModel.aggregate([
        { $match: materialFilter },
        {
          $facet: {
            // Total count
            totalCount: [{ $count: 'count' }],
            // Created in period
            createdInPeriod: [
              {
                $match: {
                  createdAt: { $gte: dateRange.start, $lte: dateRange.end },
                },
              },
              { $count: 'count' },
            ],
            // Cost statistics
            costStats: [
              {
                $group: {
                  _id: null,
                  totalCost: { $sum: '$totalCost' },
                  totalStockValue: {
                    $sum: { $multiply: ['$stockQuantity', '$costPerUnit'] },
                  },
                  totalUsedValue: {
                    $sum: { $multiply: ['$usedQuantity', '$costPerUnit'] },
                  },
                  avgCostPerUnit: { $avg: '$costPerUnit' },
                },
              },
            ],
            // By category
            byCategory: [
              {
                $group: {
                  _id: '$category',
                  count: { $sum: 1 },
                  totalCost: { $sum: '$totalCost' },
                  totalStock: { $sum: '$stockQuantity' },
                },
              },
            ],
            // By delivery status
            byDeliveryStatus: [
              {
                $group: {
                  _id: '$deliveryStatus',
                  count: { $sum: 1 },
                  totalCost: { $sum: '$totalCost' },
                },
              },
            ],
          },
        },
      ]);

      const costStats = materialsData.costStats[0] || {
        totalCost: 0,
        totalStockValue: 0,
        totalUsedValue: 0,
        avgCostPerUnit: 0,
      };

      return {
        totalMaterials: materialsData.totalCount[0]?.count || 0,
        materialsCreated: materialsData.createdInPeriod[0]?.count || 0,
        materialCosts: costStats,
        materialsByCategory: materialsData.byCategory.map((item: any) => ({
          category: item._id,
          count: item.count,
          totalCost: item.totalCost || 0,
          totalStock: item.totalStock || 0,
        })),
        materialsByDeliveryStatus: materialsData.byDeliveryStatus.map((item: any) => ({
          deliveryStatus: item._id,
          count: item.count,
          totalCost: item.totalCost || 0,
        })),
      };
    } catch (error: unknown) {
      this.handleError(error, 'get materials analytics');
    }
  }

  /**
   * Get Tasks Analytics - Optimized with single aggregation
   */
  async getTasksAnalytics(query: DashboardQueryDto) {
    try {
      const dateRange = this.getDateRange(
        query.periodType || PeriodType.MONTH,
        query.startDate,
        query.endDate,
      );
      const { taskFilter } = this.buildBaseFilter(query, dateRange);

      // Single aggregation pipeline for all tasks analytics
      const [tasksData] = await this.taskModel.aggregate([
        { $match: taskFilter },
        {
          $facet: {
            // Total count
            totalCount: [{ $count: 'count' }],
            // Created in period
            createdInPeriod: [
              {
                $match: {
                  createdAt: { $gte: dateRange.start, $lte: dateRange.end },
                },
              },
              { $count: 'count' },
            ],
            // Completed in period
            completedInPeriod: [
              {
                $match: {
                  status: 'Completed',
                  actualEndDate: { $gte: dateRange.start, $lte: dateRange.end },
                },
              },
              { $count: 'count' },
            ],
            // With issues
            withIssues: [
              {
                $match: {
                  'issues.0': { $exists: true },
                },
              },
              { $count: 'count' },
            ],
            // Average progress
            avgProgress: [
              {
                $group: {
                  _id: null,
                  avgProgress: { $avg: '$progressPercentage' },
                },
              },
            ],
            // By status
            byStatus: [
              {
                $group: {
                  _id: '$status',
                  count: { $sum: 1 },
                  avgProgress: { $avg: '$progressPercentage' },
                },
              },
            ],
          },
        },
      ]);

      return {
        totalTasks: tasksData.totalCount[0]?.count || 0,
        tasksCreated: tasksData.createdInPeriod[0]?.count || 0,
        tasksCompleted: tasksData.completedInPeriod[0]?.count || 0,
        tasksWithIssues: tasksData.withIssues[0]?.count || 0,
        avgProgress: tasksData.avgProgress[0]?.avgProgress || 0,
        tasksByStatus: tasksData.byStatus.map((item: any) => ({
          status: item._id,
          count: item.count,
          avgProgress: item.avgProgress || 0,
        })),
      };
    } catch (error: unknown) {
      this.handleError(error, 'get tasks analytics');
    }
  }

  /**
   * Get Users Analytics - Optimized with single aggregation
   */
  async getUsersAnalytics(query: DashboardQueryDto) {
    try {
      const dateRange = this.getDateRange(
        query.periodType || PeriodType.MONTH,
        query.startDate,
        query.endDate,
      );
      const { userFilter } = this.buildBaseFilter(query, dateRange);

      // Single aggregation pipeline for all users analytics
      const [usersData] = await this.userModel.aggregate([
        { $match: userFilter },
        {
          $facet: {
            // Total count
            totalCount: [{ $count: 'count' }],
            // Active count
            activeCount: [
              { $match: { is_active: true } },
              { $count: 'count' },
            ],
            // Created in period
            createdInPeriod: [
              {
                $match: {
                  createdAt: { $gte: dateRange.start, $lte: dateRange.end },
                },
              },
              { $count: 'count' },
            ],
            // By role
            byRole: [
              {
                $lookup: {
                  from: 'roles',
                  localField: 'role',
                  foreignField: '_id',
                  as: 'roleData',
                },
              },
              { $unwind: { path: '$roleData', preserveNullAndEmptyArrays: true } },
              {
                $group: {
                  _id: '$roleData.name',
                  count: { $sum: 1 },
                },
              },
            ],
          },
        },
      ]);

      return {
        totalUsers: usersData.totalCount[0]?.count || 0,
        activeUsers: usersData.activeCount[0]?.count || 0,
        usersCreated: usersData.createdInPeriod[0]?.count || 0,
        usersByRole: usersData.byRole.map((item: any) => ({
          role: item._id || 'Unknown',
          count: item.count,
        })),
      };
    } catch (error: unknown) {
      this.handleError(error, 'get users analytics');
    }
  }

  /**
   * Get Comprehensive Dashboard Analytics - Optimized with parallel execution
   */
  async getDashboardAnalytics(query: DashboardQueryDto) {
    try {
      const [projects, attendance, salary, materials, tasks, users] = await Promise.all([
        this.getProjectsAnalytics(query),
        this.getAttendanceAnalytics(query),
        this.getSalaryAnalytics(query),
        this.getMaterialsAnalytics(query),
        this.getTasksAnalytics(query),
        this.getUsersAnalytics(query),
      ]);

      return {
        period: {
          type: query.periodType || PeriodType.MONTH,
          startDate: query.startDate,
          endDate: query.endDate,
        },
        projects,
        attendance,
        salary,
        materials,
        tasks,
        users,
        summary: {
          totalProjects: projects.totalProjects,
          totalUsers: users.totalUsers,
          totalSalary: salary.totalSalary,
          totalMaterialCost: materials.materialCosts.totalCost,
          attendanceRate: attendance.attendanceRate,
          taskCompletionRate:
            tasks.totalTasks > 0
              ? Math.round((tasks.tasksCompleted / tasks.totalTasks) * 100 * 100) / 100
              : 0,
        },
      };
    } catch (error: unknown) {
      this.handleError(error, 'get dashboard analytics');
    }
  }
}
