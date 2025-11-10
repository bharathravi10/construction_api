import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Patch, 
  Post, 
  HttpCode, 
  HttpStatus,
  Query 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CreateSalaryRateDto, UpdateSalaryRateDto, CalculateSalaryDto, GetSalaryCalculationDto } from './salary.dto';
import { SalaryService } from './salary.service';

@ApiTags('Salary')
@Controller('salary')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  // ==================== Salary Rate Endpoints ====================

  @Post('rate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new salary rate for a user (with or without project)' })
  @ApiResponse({ status: 201, description: 'Salary rate successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBody({ type: CreateSalaryRateDto })
  async createSalaryRate(@Body() createSalaryRateDto: CreateSalaryRateDto) {
    return this.salaryService.createSalaryRate(createSalaryRateDto);
  }

  @Get('rate')
  @ApiOperation({ summary: 'Get all salary rates (optionally filtered by user, project, or active status)' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'projectId', required: false, description: 'Filter by project ID (use "null" for base salary)' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status (true/false)' })
  @ApiResponse({ status: 200, description: 'List of salary rates.' })
  async getSalaryRates(
    @Query('userId') userId?: string,
    @Query('projectId') projectId?: string,
    @Query('isActive') isActive?: string
  ) {
    const filters: any = {};
    if (userId) filters.userId = userId;
    if (projectId) filters.projectId = projectId;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    return this.salaryService.getSalaryRates(filters);
  }

  @Get('rate/:id')
  @ApiOperation({ summary: 'Get a salary rate by ID' })
  @ApiParam({ name: 'id', description: 'Salary rate ID' })
  @ApiResponse({ status: 200, description: 'Salary rate details.' })
  @ApiResponse({ status: 404, description: 'Salary rate not found.' })
  async getSalaryRateById(@Param('id') id: string) {
    return this.salaryService.getSalaryRateById(id);
  }

  @Patch('rate/:id')
  @ApiOperation({ summary: 'Update salary rate details' })
  @ApiParam({ name: 'id', description: 'Salary rate ID' })
  @ApiBody({ type: UpdateSalaryRateDto })
  @ApiResponse({ status: 200, description: 'Salary rate successfully updated.' })
  @ApiResponse({ status: 404, description: 'Salary rate not found.' })
  async updateSalaryRate(@Param('id') id: string, @Body() updateSalaryRateDto: UpdateSalaryRateDto) {
    return this.salaryService.updateSalaryRate(id, updateSalaryRateDto);
  }

  @Delete('rate/:id')
  @ApiOperation({ summary: 'Soft delete a salary rate' })
  @ApiParam({ name: 'id', description: 'Salary rate ID' })
  @ApiResponse({ status: 200, description: 'Salary rate successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Salary rate not found.' })
  async deleteSalaryRate(@Param('id') id: string) {
    return this.salaryService.deleteSalaryRate(id);
  }

  // ==================== Salary Calculation Endpoints ====================

  @Post('calculate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Calculate salary for a user based on attendance records' })
  @ApiResponse({ status: 201, description: 'Salary successfully calculated.' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data or calculation already exists.' })
  @ApiResponse({ status: 404, description: 'User or salary rate not found.' })
  @ApiBody({ type: CalculateSalaryDto })
  async calculateSalary(@Body() calculateSalaryDto: CalculateSalaryDto) {
    return this.salaryService.calculateSalary(calculateSalaryDto);
  }

  @Get('calculation')
  @ApiOperation({ summary: 'Get all salary calculations (optionally filtered)' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'projectId', required: false, description: 'Filter by project ID' })
  @ApiQuery({ name: 'periodType', required: false, description: 'Filter by period type (month, week, year, custom)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter by start date' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter by end date' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status (pending, calculated, approved, paid)' })
  @ApiResponse({ status: 200, description: 'List of salary calculations.' })
  async getSalaryCalculations(
    @Query('userId') userId?: string,
    @Query('projectId') projectId?: string,
    @Query('periodType') periodType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string
  ) {
    const filters: GetSalaryCalculationDto = {
      ...(userId && { userId: userId as any }),
      ...(projectId && { projectId: projectId as any }),
      ...(periodType && { periodType: periodType as any }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(status && { status: status as any }),
    };
    return this.salaryService.getSalaryCalculations(filters);
  }

  @Get('calculation/:id')
  @ApiOperation({ summary: 'Get a salary calculation by ID' })
  @ApiParam({ name: 'id', description: 'Salary calculation ID' })
  @ApiResponse({ status: 200, description: 'Salary calculation details.' })
  @ApiResponse({ status: 404, description: 'Salary calculation not found.' })
  async getSalaryCalculationById(@Param('id') id: string) {
    return this.salaryService.getSalaryCalculationById(id);
  }

  @Patch('calculation/:id/status')
  @ApiOperation({ summary: 'Update salary calculation status (approve, mark as paid, etc.)' })
  @ApiParam({ name: 'id', description: 'Salary calculation ID' })
  @ApiQuery({ name: 'status', required: true, description: 'New status (pending, calculated, approved, paid)' })
  @ApiResponse({ status: 200, description: 'Salary calculation status successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid status.' })
  @ApiResponse({ status: 404, description: 'Salary calculation not found.' })
  async updateSalaryCalculationStatus(
    @Param('id') id: string,
    @Query('status') status: string
  ) {
    return this.salaryService.updateSalaryCalculationStatus(id, status);
  }

  @Delete('calculation/:id')
  @ApiOperation({ summary: 'Soft delete a salary calculation' })
  @ApiParam({ name: 'id', description: 'Salary calculation ID' })
  @ApiResponse({ status: 200, description: 'Salary calculation successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Salary calculation not found.' })
  async deleteSalaryCalculation(@Param('id') id: string) {
    return this.salaryService.deleteSalaryCalculation(id);
  }
}

