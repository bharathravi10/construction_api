import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalaryRate, SalaryRateSchema } from '../../common/schemas/salary-rate.schema';
import { SalaryCalculation, SalaryCalculationSchema } from '../../common/schemas/salary-calculation.schema';
import { Attendance, AttendanceSchema } from '../../common/schemas/attendance.schema';
import { User, UserSchema } from '../../common/schemas/user.schema';
import { SalaryService } from './salary.service';
import { SalaryController } from './salary.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SalaryRate.name, schema: SalaryRateSchema },
      { name: SalaryCalculation.name, schema: SalaryCalculationSchema },
      { name: Attendance.name, schema: AttendanceSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [SalaryController],
  providers: [SalaryService],
})
export class SalaryModule {}

