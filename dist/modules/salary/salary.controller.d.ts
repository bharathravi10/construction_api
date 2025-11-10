import { CreateSalaryRateDto, UpdateSalaryRateDto, CalculateSalaryDto } from './salary.dto';
import { SalaryService } from './salary.service';
export declare class SalaryController {
    private readonly salaryService;
    constructor(salaryService: SalaryService);
    createSalaryRate(createSalaryRateDto: CreateSalaryRateDto): Promise<{
        message: string;
    }>;
    getSalaryRates(userId?: string, projectId?: string, isActive?: string): Promise<any[]>;
    getSalaryRateById(id: string): Promise<any>;
    updateSalaryRate(id: string, updateSalaryRateDto: UpdateSalaryRateDto): Promise<Partial<import("../../common/schemas/salary-rate.schema").SalaryRate>>;
    deleteSalaryRate(id: string): Promise<{
        message: string;
    }>;
    calculateSalary(calculateSalaryDto: CalculateSalaryDto): Promise<import("../../common/schemas/salary-calculation.schema").SalaryCalculationDocument>;
    getSalaryCalculations(userId?: string, projectId?: string, periodType?: string, startDate?: string, endDate?: string, status?: string): Promise<any[]>;
    getSalaryCalculationById(id: string): Promise<any>;
    updateSalaryCalculationStatus(id: string, status: string): Promise<Partial<import("../../common/schemas/salary-calculation.schema").SalaryCalculation>>;
    deleteSalaryCalculation(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=salary.controller.d.ts.map