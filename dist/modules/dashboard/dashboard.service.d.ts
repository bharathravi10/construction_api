import { Model } from 'mongoose';
import { ProjectDocument } from '../../common/schemas/projects.schema';
import { UserDocument } from '../../common/schemas/user.schema';
import { AttendanceDocument } from '../../common/schemas/attendance.schema';
import { SalaryCalculationDocument } from '../../common/schemas/salary-calculation.schema';
import { MaterialDocument } from '../../common/schemas/material.schema';
import { TaskDocument } from '../../common/schemas/task.schema';
import { DashboardQueryDto, PeriodType } from './dashboard.dto';
export declare class DashboardService {
    private readonly projectModel;
    private readonly userModel;
    private readonly attendanceModel;
    private readonly salaryCalculationModel;
    private readonly materialModel;
    private readonly taskModel;
    private readonly logger;
    constructor(projectModel: Model<ProjectDocument>, userModel: Model<UserDocument>, attendanceModel: Model<AttendanceDocument>, salaryCalculationModel: Model<SalaryCalculationDocument>, materialModel: Model<MaterialDocument>, taskModel: Model<TaskDocument>);
    private getDateRange;
    private buildBaseFilter;
    private handleError;
    getProjectsAnalytics(query: DashboardQueryDto): Promise<{
        totalProjects: any;
        activeProjects: any;
        projectsCreated: any;
        projectsByStatus: any;
        budgetStats: any;
    }>;
    getAttendanceAnalytics(query: DashboardQueryDto): Promise<{
        totalRecords: any;
        uniqueUsers: any;
        presentCount: any;
        absentCount: any;
        halfdayCount: any;
        attendanceRate: number;
        totalOvertimeMinutes: any;
        totalOvertimeHours: number;
        attendanceByStatus: any;
        dailyBreakdown: any;
    }>;
    getSalaryAnalytics(query: DashboardQueryDto): Promise<{
        totalSalary: any;
        totalBaseSalary: any;
        totalOvertimeSalary: any;
        totalHalfDaySalary: any;
        totalRecords: any;
        avgSalary: any;
        uniqueUsers: any;
        salaryByStatus: any;
        salaryByCalculationType: any;
        periodBreakdown: any;
    }>;
    getMaterialsAnalytics(query: DashboardQueryDto): Promise<{
        totalMaterials: any;
        materialsCreated: any;
        materialCosts: any;
        materialsByCategory: any;
        materialsByDeliveryStatus: any;
    }>;
    getTasksAnalytics(query: DashboardQueryDto): Promise<{
        totalTasks: any;
        tasksCreated: any;
        tasksCompleted: any;
        tasksWithIssues: any;
        avgProgress: any;
        tasksByStatus: any;
    }>;
    getUsersAnalytics(query: DashboardQueryDto): Promise<{
        totalUsers: any;
        activeUsers: any;
        usersCreated: any;
        usersByRole: any;
    }>;
    getDashboardAnalytics(query: DashboardQueryDto): Promise<{
        period: {
            type: PeriodType;
            startDate: string | undefined;
            endDate: string | undefined;
        };
        projects: {
            totalProjects: any;
            activeProjects: any;
            projectsCreated: any;
            projectsByStatus: any;
            budgetStats: any;
        };
        attendance: {
            totalRecords: any;
            uniqueUsers: any;
            presentCount: any;
            absentCount: any;
            halfdayCount: any;
            attendanceRate: number;
            totalOvertimeMinutes: any;
            totalOvertimeHours: number;
            attendanceByStatus: any;
            dailyBreakdown: any;
        };
        salary: {
            totalSalary: any;
            totalBaseSalary: any;
            totalOvertimeSalary: any;
            totalHalfDaySalary: any;
            totalRecords: any;
            avgSalary: any;
            uniqueUsers: any;
            salaryByStatus: any;
            salaryByCalculationType: any;
            periodBreakdown: any;
        };
        materials: {
            totalMaterials: any;
            materialsCreated: any;
            materialCosts: any;
            materialsByCategory: any;
            materialsByDeliveryStatus: any;
        };
        tasks: {
            totalTasks: any;
            tasksCreated: any;
            tasksCompleted: any;
            tasksWithIssues: any;
            avgProgress: any;
            tasksByStatus: any;
        };
        users: {
            totalUsers: any;
            activeUsers: any;
            usersCreated: any;
            usersByRole: any;
        };
        summary: {
            totalProjects: any;
            totalUsers: any;
            totalSalary: any;
            totalMaterialCost: any;
            attendanceRate: number;
            taskCompletionRate: number;
        };
    }>;
}
//# sourceMappingURL=dashboard.service.d.ts.map