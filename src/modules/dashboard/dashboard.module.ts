import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from '../../common/schemas/projects.schema';
import { User, UserSchema } from '../../common/schemas/user.schema';
import { Attendance, AttendanceSchema } from '../../common/schemas/attendance.schema';
import { SalaryCalculation, SalaryCalculationSchema } from '../../common/schemas/salary-calculation.schema';
import { Material, MaterialSchema } from '../../common/schemas/material.schema';
import { Task, TaskSchema } from '../../common/schemas/task.schema';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: User.name, schema: UserSchema },
      { name: Attendance.name, schema: AttendanceSchema },
      { name: SalaryCalculation.name, schema: SalaryCalculationSchema },
      { name: Material.name, schema: MaterialSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}

