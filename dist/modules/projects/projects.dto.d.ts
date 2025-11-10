export declare class CreateProjectDto {
    readonly name: string;
    readonly description: string;
    readonly address: string;
    readonly state: string;
    readonly plannedStartDate: Date;
    readonly plannedEndDate: Date;
    readonly actualStartDate?: Date;
    readonly actualEndDate?: Date;
    readonly status?: string;
    readonly estimatedBudget?: number;
    readonly totalPriceValue?: number;
    readonly totalEarnedValue?: number;
    readonly progressPercentage?: number;
    readonly documents?: string[];
    readonly remarks?: string;
    readonly isActive?: boolean;
}
export declare class UpdateProjectDto {
    readonly name?: string;
    readonly description?: string;
    readonly address?: string;
    readonly state?: string;
    readonly plannedStartDate?: Date;
    readonly plannedEndDate?: Date;
    readonly actualStartDate?: Date;
    readonly actualEndDate?: Date;
    readonly status?: string;
    readonly estimatedBudget?: number;
    readonly totalPriceValue?: number;
    readonly totalEarnedValue?: number;
    readonly progressPercentage?: number;
    readonly documents?: string[];
    readonly remarks?: string;
    readonly isActive?: boolean;
}
//# sourceMappingURL=projects.dto.d.ts.map