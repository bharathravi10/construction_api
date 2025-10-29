import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Material, MaterialSchema } from '../../common/schemas/material.schema';
import { Project, ProjectSchema } from '../../common/schemas/projects.schema';
import { MaterialsService } from './materials.service';
import { MaterialsController } from './materials.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Material.name, schema: MaterialSchema },
      { name: Project.name, schema: ProjectSchema }
    ])
  ],
  controllers: [MaterialsController],
  providers: [MaterialsService],
})
export class MaterialsModule {}

