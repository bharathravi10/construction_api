"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DashboardService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const projects_schema_1 = require("../../common/schemas/projects.schema");
const user_schema_1 = require("../../common/schemas/user.schema");
const attendance_schema_1 = require("../../common/schemas/attendance.schema");
const salary_calculation_schema_1 = require("../../common/schemas/salary-calculation.schema");
const material_schema_1 = require("../../common/schemas/material.schema");
const task_schema_1 = require("../../common/schemas/task.schema");
const dashboard_dto_1 = require("./dashboard.dto");
const mongoose_3 = require("mongoose");
let DashboardService = DashboardService_1 = class DashboardService {
    constructor(projectModel, userModel, attendanceModel, salaryCalculationModel, materialModel, taskModel) {
        this.projectModel = projectModel;
        this.userModel = userModel;
        this.attendanceModel = attendanceModel;
        this.salaryCalculationModel = salaryCalculationModel;
        this.materialModel = materialModel;
        this.taskModel = taskModel;
        this.logger = new common_1.Logger(DashboardService_1.name);
    }
    getDateRange(periodType, startDate, endDate) {
        if (startDate && endDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            return { start, end };
        }
        const now = new Date();
        let start;
        let end;
        switch (periodType) {
            case dashboard_dto_1.PeriodType.DAY:
                start = new Date(now);
                start.setHours(0, 0, 0, 0);
                end = new Date(now);
                end.setHours(23, 59, 59, 999);
                break;
            case dashboard_dto_1.PeriodType.WEEK:
                start = new Date(now);
                const dayOfWeek = start.getDay();
                const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                start.setDate(diff);
                start.setHours(0, 0, 0, 0);
                end = new Date(start);
                end.setDate(start.getDate() + 6);
                end.setHours(23, 59, 59, 999);
                break;
            case dashboard_dto_1.PeriodType.MONTH:
            default:
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                start.setHours(0, 0, 0, 0);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                end.setHours(23, 59, 59, 999);
                break;
        }
        return { start, end };
    }
    buildBaseFilter(query, dateRange) {
        const projectFilter = { is_deleted: false };
        const userFilter = { is_deleted: false };
        const attendanceFilter = { is_deleted: false };
        const salaryFilter = { is_deleted: false };
        const materialFilter = { is_deleted: false };
        const taskFilter = { is_deleted: false };
        if (query.projectId) {
            const projectId = new mongoose_3.Types.ObjectId(query.projectId.toString());
            projectFilter._id = projectId;
            materialFilter.project = projectId;
            taskFilter.project = projectId;
            salaryFilter.project = projectId;
        }
        if (query.userId) {
            const userId = new mongoose_3.Types.ObjectId(query.userId.toString());
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
    handleError(error, context) {
        if (error instanceof Error) {
            this.logger.error(`Failed to ${context}`, error.stack);
            throw error;
        }
        throw new Error(`Failed to ${context}`);
    }
    async getProjectsAnalytics(query) {
        try {
            const dateRange = this.getDateRange(query.periodType || dashboard_dto_1.PeriodType.MONTH, query.startDate, query.endDate);
            const { projectFilter } = this.buildBaseFilter(query, dateRange);
            const [projectsData] = await this.projectModel.aggregate([
                { $match: projectFilter },
                {
                    $facet: {
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
                projectsByStatus: projectsData.byStatus.map((item) => ({
                    status: item._id,
                    count: item.count,
                    totalBudget: item.totalBudget || 0,
                    totalEarned: item.totalEarned || 0,
                })),
                budgetStats,
            };
        }
        catch (error) {
            this.handleError(error, 'get projects analytics');
        }
    }
    async getAttendanceAnalytics(query) {
        try {
            const dateRange = this.getDateRange(query.periodType || dashboard_dto_1.PeriodType.MONTH, query.startDate, query.endDate);
            const { attendanceFilter } = this.buildBaseFilter(query, dateRange);
            const [attendanceData] = await this.attendanceModel.aggregate([
                { $match: attendanceFilter },
                {
                    $facet: {
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
                        byStatus: [
                            {
                                $group: {
                                    _id: '$status',
                                    count: { $sum: 1 },
                                    totalOvertime: { $sum: '$overtime' },
                                },
                            },
                        ],
                        uniqueUsers: [{ $group: { _id: '$user' } }, { $count: 'count' }],
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
            const attendanceRate = summary.totalRecords > 0
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
                attendanceByStatus: attendanceData.byStatus.map((item) => ({
                    status: item._id,
                    count: item.count,
                    totalOvertimeMinutes: item.totalOvertime || 0,
                })),
                dailyBreakdown: attendanceData.dailyBreakdown,
            };
        }
        catch (error) {
            this.handleError(error, 'get attendance analytics');
        }
    }
    async getSalaryAnalytics(query) {
        try {
            const dateRange = this.getDateRange(query.periodType || dashboard_dto_1.PeriodType.MONTH, query.startDate, query.endDate);
            const { salaryFilter } = this.buildBaseFilter(query, dateRange);
            const [salaryData] = await this.salaryCalculationModel.aggregate([
                { $match: salaryFilter },
                {
                    $facet: {
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
                        byStatus: [
                            {
                                $group: {
                                    _id: '$status',
                                    count: { $sum: 1 },
                                    totalSalary: { $sum: '$totalSalary' },
                                },
                            },
                        ],
                        byCalculationType: [
                            {
                                $group: {
                                    _id: '$calculationType',
                                    count: { $sum: 1 },
                                    totalSalary: { $sum: '$totalSalary' },
                                },
                            },
                        ],
                        uniqueUsers: [{ $group: { _id: '$user' } }, { $count: 'count' }],
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
                salaryByStatus: salaryData.byStatus.map((item) => ({
                    status: item._id,
                    count: item.count,
                    totalSalary: item.totalSalary || 0,
                })),
                salaryByCalculationType: salaryData.byCalculationType.map((item) => ({
                    calculationType: item._id,
                    count: item.count,
                    totalSalary: item.totalSalary || 0,
                })),
                periodBreakdown: salaryData.periodBreakdown,
            };
        }
        catch (error) {
            this.handleError(error, 'get salary analytics');
        }
    }
    async getMaterialsAnalytics(query) {
        try {
            const dateRange = this.getDateRange(query.periodType || dashboard_dto_1.PeriodType.MONTH, query.startDate, query.endDate);
            const { materialFilter } = this.buildBaseFilter(query, dateRange);
            const [materialsData] = await this.materialModel.aggregate([
                { $match: materialFilter },
                {
                    $facet: {
                        totalCount: [{ $count: 'count' }],
                        createdInPeriod: [
                            {
                                $match: {
                                    createdAt: { $gte: dateRange.start, $lte: dateRange.end },
                                },
                            },
                            { $count: 'count' },
                        ],
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
                materialsByCategory: materialsData.byCategory.map((item) => ({
                    category: item._id,
                    count: item.count,
                    totalCost: item.totalCost || 0,
                    totalStock: item.totalStock || 0,
                })),
                materialsByDeliveryStatus: materialsData.byDeliveryStatus.map((item) => ({
                    deliveryStatus: item._id,
                    count: item.count,
                    totalCost: item.totalCost || 0,
                })),
            };
        }
        catch (error) {
            this.handleError(error, 'get materials analytics');
        }
    }
    async getTasksAnalytics(query) {
        try {
            const dateRange = this.getDateRange(query.periodType || dashboard_dto_1.PeriodType.MONTH, query.startDate, query.endDate);
            const { taskFilter } = this.buildBaseFilter(query, dateRange);
            const [tasksData] = await this.taskModel.aggregate([
                { $match: taskFilter },
                {
                    $facet: {
                        totalCount: [{ $count: 'count' }],
                        createdInPeriod: [
                            {
                                $match: {
                                    createdAt: { $gte: dateRange.start, $lte: dateRange.end },
                                },
                            },
                            { $count: 'count' },
                        ],
                        completedInPeriod: [
                            {
                                $match: {
                                    status: 'Completed',
                                    actualEndDate: { $gte: dateRange.start, $lte: dateRange.end },
                                },
                            },
                            { $count: 'count' },
                        ],
                        withIssues: [
                            {
                                $match: {
                                    'issues.0': { $exists: true },
                                },
                            },
                            { $count: 'count' },
                        ],
                        avgProgress: [
                            {
                                $group: {
                                    _id: null,
                                    avgProgress: { $avg: '$progressPercentage' },
                                },
                            },
                        ],
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
                tasksByStatus: tasksData.byStatus.map((item) => ({
                    status: item._id,
                    count: item.count,
                    avgProgress: item.avgProgress || 0,
                })),
            };
        }
        catch (error) {
            this.handleError(error, 'get tasks analytics');
        }
    }
    async getUsersAnalytics(query) {
        try {
            const dateRange = this.getDateRange(query.periodType || dashboard_dto_1.PeriodType.MONTH, query.startDate, query.endDate);
            const { userFilter } = this.buildBaseFilter(query, dateRange);
            const [usersData] = await this.userModel.aggregate([
                { $match: userFilter },
                {
                    $facet: {
                        totalCount: [{ $count: 'count' }],
                        activeCount: [
                            { $match: { is_active: true } },
                            { $count: 'count' },
                        ],
                        createdInPeriod: [
                            {
                                $match: {
                                    createdAt: { $gte: dateRange.start, $lte: dateRange.end },
                                },
                            },
                            { $count: 'count' },
                        ],
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
                usersByRole: usersData.byRole.map((item) => ({
                    role: item._id || 'Unknown',
                    count: item.count,
                })),
            };
        }
        catch (error) {
            this.handleError(error, 'get users analytics');
        }
    }
    async getDashboardAnalytics(query) {
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
                    type: query.periodType || dashboard_dto_1.PeriodType.MONTH,
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
                    taskCompletionRate: tasks.totalTasks > 0
                        ? Math.round((tasks.tasksCompleted / tasks.totalTasks) * 100 * 100) / 100
                        : 0,
                },
            };
        }
        catch (error) {
            this.handleError(error, 'get dashboard analytics');
        }
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = DashboardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(projects_schema_1.Project.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(attendance_schema_1.Attendance.name)),
    __param(3, (0, mongoose_1.InjectModel)(salary_calculation_schema_1.SalaryCalculation.name)),
    __param(4, (0, mongoose_1.InjectModel)(material_schema_1.Material.name)),
    __param(5, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DashboardService);
