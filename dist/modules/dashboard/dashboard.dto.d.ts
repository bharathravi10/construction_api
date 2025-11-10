import { Types } from 'mongoose';
export declare enum PeriodType {
    DAY = "day",
    WEEK = "week",
    MONTH = "month"
}
export declare class DashboardQueryDto {
    readonly periodType?: PeriodType;
    readonly startDate?: string;
    readonly endDate?: string;
    readonly projectId?: Types.ObjectId;
    readonly userId?: Types.ObjectId;
}
export declare class ProjectsAnalyticsResponseDto {
    totalProjects: number;
    activeProjects: number;
    projectsCreated: number;
    projectsByStatus: Array<{
        status: string;
        count: number;
        totalBudget: number;
        totalEarned: number;
    }>;
    budgetStats: {
        totalEstimatedBudget: number;
        totalActualSpending: number;
        totalEarnedValue: number;
        avgProgress: number;
    };
}
export declare class AttendanceAnalyticsResponseDto {
    totalRecords: number;
    uniqueUsers: number;
    presentCount: number;
    absentCount: number;
    halfdayCount: number;
    attendanceRate: number;
    totalOvertimeMinutes: number;
    totalOvertimeHours: number;
    attendanceByStatus: Array<{
        status: string;
        count: number;
        totalOvertimeMinutes: number;
    }>;
    dailyBreakdown: Array<{
        _id: string;
        present: number;
        absent: number;
        halfday: number;
        totalOvertime: number;
    }>;
}
export declare class SalaryAnalyticsResponseDto {
    totalSalary: number;
    totalBaseSalary: number;
    totalOvertimeSalary: number;
    totalHalfDaySalary: number;
    totalRecords: number;
    avgSalary: number;
    uniqueUsers: number;
    salaryByStatus: Array<{
        status: string;
        count: number;
        totalSalary: number;
    }>;
    salaryByCalculationType: Array<{
        calculationType: string;
        count: number;
        totalSalary: number;
    }>;
    periodBreakdown: Array<{
        _id: string;
        totalSalary: number;
        count: number;
    }>;
}
export declare class MaterialsAnalyticsResponseDto {
    totalMaterials: number;
    materialsCreated: number;
    materialCosts: {
        totalCost: number;
        totalStockValue: number;
        totalUsedValue: number;
        avgCostPerUnit: number;
    };
    materialsByCategory: Array<{
        category: string;
        count: number;
        totalCost: number;
        totalStock: number;
    }>;
    materialsByDeliveryStatus: Array<{
        deliveryStatus: string;
        count: number;
        totalCost: number;
    }>;
}
export declare class TasksAnalyticsResponseDto {
    totalTasks: number;
    tasksCreated: number;
    tasksCompleted: number;
    tasksWithIssues: number;
    avgProgress: number;
    tasksByStatus: Array<{
        status: string;
        count: number;
        avgProgress: number;
    }>;
}
export declare class UsersAnalyticsResponseDto {
    totalUsers: number;
    activeUsers: number;
    usersCreated: number;
    usersByRole: Array<{
        role: string;
        count: number;
    }>;
}
export declare class DashboardAnalyticsResponseDto {
    period: {
        type: PeriodType;
        startDate?: string;
        endDate?: string;
    };
    projects: ProjectsAnalyticsResponseDto;
    attendance: AttendanceAnalyticsResponseDto;
    salary: SalaryAnalyticsResponseDto;
    materials: MaterialsAnalyticsResponseDto;
    tasks: TasksAnalyticsResponseDto;
    users: UsersAnalyticsResponseDto;
    summary: {
        totalProjects: number;
        totalUsers: number;
        totalSalary: number;
        totalMaterialCost: number;
        attendanceRate: number;
        taskCompletionRate: number;
    };
}
//# sourceMappingURL=dashboard.dto.d.ts.map