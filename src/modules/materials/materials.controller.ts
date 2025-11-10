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
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreateMaterialDto, UpdateMaterialDto, UpdateMaterialUsageDto, UpdateDeliveryStatusDto, UpdateInsufficientStatusDto } from './materials.dto';
import { MaterialsService } from './materials.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Materials')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new material' })
  @ApiResponse({ status: 201, description: 'Material successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Project not found (if project ID is provided).' })
  @ApiBody({ type: CreateMaterialDto })
  async create(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialsService.create(createMaterialDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all materials (optionally filtered by project, category, or delivery status)' })
  @ApiQuery({ name: 'projectId', required: false, description: 'Filter by project ID' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'deliveryStatus', required: false, description: 'Filter by delivery status' })
  @ApiResponse({ status: 200, description: 'List of materials.' })
  async findAll(
    @Query('projectId') projectId?: string,
    @Query('category') category?: string,
    @Query('deliveryStatus') deliveryStatus?: string
  ) {
    return this.materialsService.findAll({ projectId, category, deliveryStatus });
  }

  @Get('insufficient')
  @ApiOperation({ summary: 'Get all materials with insufficient stock' })
  @ApiQuery({ name: 'projectId', required: false, description: 'Filter by project ID' })
  @ApiResponse({ status: 200, description: 'List of materials with insufficient stock.' })
  async getInsufficientMaterials(@Query('projectId') projectId?: string) {
    return this.materialsService.getInsufficientMaterials(projectId);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all materials assigned to a specific project' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'List of materials for the project.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  async getMaterialsByProject(@Param('projectId') projectId: string) {
    return this.materialsService.getMaterialsByProject(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a material by ID' })
  @ApiParam({ name: 'id', description: 'Material ID' })
  @ApiResponse({ status: 200, description: 'Material details.' })
  @ApiResponse({ status: 404, description: 'Material not found.' })
  async findOne(@Param('id') id: string) {
    return this.materialsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update material details' })
  @ApiParam({ name: 'id', description: 'Material ID' })
  @ApiBody({ type: UpdateMaterialDto })
  @ApiResponse({ status: 200, description: 'Material successfully updated.' })
  @ApiResponse({ status: 404, description: 'Material not found.' })
  async update(@Param('id') id: string, @Body() updateMaterialDto: UpdateMaterialDto) {
    return this.materialsService.update(id, updateMaterialDto);
  }

  @Patch(':id/usage')
  @ApiOperation({ summary: 'Update material usage quantity' })
  @ApiParam({ name: 'id', description: 'Material ID' })
  @ApiBody({ type: UpdateMaterialUsageDto })
  @ApiResponse({ status: 200, description: 'Material usage successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request - Used quantity exceeds stock quantity.' })
  @ApiResponse({ status: 404, description: 'Material not found.' })
  async updateUsage(@Param('id') id: string, @Body() updateUsageDto: UpdateMaterialUsageDto) {
    return this.materialsService.updateUsage(id, updateUsageDto);
  }

  @Patch(':id/delivery')
  @ApiOperation({ summary: 'Update material delivery status' })
  @ApiParam({ name: 'id', description: 'Material ID' })
  @ApiBody({ type: UpdateDeliveryStatusDto })
  @ApiResponse({ status: 200, description: 'Delivery status successfully updated.' })
  @ApiResponse({ status: 404, description: 'Material not found.' })
  async updateDeliveryStatus(@Param('id') id: string, @Body() updateDeliveryDto: UpdateDeliveryStatusDto) {
    return this.materialsService.updateDeliveryStatus(id, updateDeliveryDto);
  }

  @Patch(':id/insufficient')
  @ApiOperation({ summary: 'Update material insufficient stock status manually' })
  @ApiParam({ name: 'id', description: 'Material ID' })
  @ApiBody({ type: UpdateInsufficientStatusDto })
  @ApiResponse({ status: 200, description: 'Insufficient status successfully updated.' })
  @ApiResponse({ status: 404, description: 'Material not found.' })
  async updateInsufficientStatus(@Param('id') id: string, @Body() updateInsufficientDto: UpdateInsufficientStatusDto) {
    return this.materialsService.updateInsufficientStatus(id, updateInsufficientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a material' })
  @ApiParam({ name: 'id', description: 'Material ID' })
  @ApiResponse({ status: 200, description: 'Material successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Material not found.' })
  async remove(@Param('id') id: string) {
    return this.materialsService.softDelete(id);
  }
}

