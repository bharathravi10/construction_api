import { DashboardService } from './dashboard.service';
import { DashboardQueryDto, PeriodType, DashboardAnalyticsResponseDto, ProjectsAnalyticsResponseDto, AttendanceAnalyticsResponseDto, SalaryAnalyticsResponseDto, MaterialsAnalyticsResponseDto, TasksAnalyticsResponseDto, UsersAnalyticsResponseDto } from './dashboard.dto';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboard(query: DashboardQueryDto): Promise<DashboardAnalyticsResponseDto>;
    getProjectsAnalytics(query: DashboardQueryDto): Promise<ProjectsAnalyticsResponseDto>;
    getAttendanceAnalytics(query: DashboardQueryDto): Promise<AttendanceAnalyticsResponseDto>;
    getSalaryAnalytics(query: DashboardQueryDto): Promise<SalaryAnalyticsResponseDto>;
    getMaterialsAnalytics(query: DashboardQueryDto): Promise<MaterialsAnalyticsResponseDto>;
    getTasksAnalytics(query: DashboardQueryDto): Promise<TasksAnalyticsResponseDto>;
    getUsersAnalytics(query: DashboardQueryDto): Promise<UsersAnalyticsResponseDto>;
    getDayWiseAnalytics(query: DashboardQueryDto): Promise<{
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
    getWeekWiseAnalytics(query: DashboardQueryDto): Promise<{
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
    getMonthWiseAnalytics(query: DashboardQueryDto): Promise<{
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
//# sourceMappingURL=dashboard.controller.d.ts.map