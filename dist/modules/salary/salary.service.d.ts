import { Model } from 'mongoose';
import { SalaryRate, SalaryRateDocument } from '../../common/schemas/salary-rate.schema';
import { SalaryCalculation, SalaryCalculationDocument } from '../../common/schemas/salary-calculation.schema';
import { AttendanceDocument } from '../../common/schemas/attendance.schema';
import { UserDocument } from '../../common/schemas/user.schema';
import { CreateSalaryRateDto, UpdateSalaryRateDto, CalculateSalaryDto, GetSalaryCalculationDto } from './salary.dto';
export declare class SalaryService {
    private readonly salaryRateModel;
    private readonly salaryCalculationModel;
    private readonly attendanceModel;
    private readonly userModel;
    private readonly logger;
    constructor(salaryRateModel: Model<SalaryRateDocument>, salaryCalculationModel: Model<SalaryCalculationDocument>, attendanceModel: Model<AttendanceDocument>, userModel: Model<UserDocument>);
    private handleError;
    private validateUser;
    private getActiveSalaryRate;
    private calculateWorkingHours;
    calculateSalary(calculateSalaryDto: CalculateSalaryDto): Promise<SalaryCalculationDocument>;
    private validateSalaryRateData;
    private validateProjectBasedSalary;
    createSalaryRate(createSalaryRateDto: CreateSalaryRateDto): Promise<{
        message: string;
    }>;
    getSalaryRates(filters?: {
        userId?: string;
        projectId?: string;
        isActive?: boolean;
    }): Promise<any[]>;
    getSalaryRateById(id: string): Promise<any>;
    updateSalaryRate(id: string, updateSalaryRateDto: UpdateSalaryRateDto): Promise<Partial<SalaryRate>>;
    deleteSalaryRate(id: string): Promise<{
        message: string;
    }>;
    getSalaryCalculations(filters?: GetSalaryCalculationDto): Promise<any[]>;
    getSalaryCalculationById(id: string): Promise<any>;
    updateSalaryCalculationStatus(id: string, status: string): Promise<Partial<SalaryCalculation>>;
    deleteSalaryCalculation(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=salary.service.d.ts.map