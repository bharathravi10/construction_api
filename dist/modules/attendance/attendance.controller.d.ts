import { CreateAttendanceDto, UpdateAttendanceDto } from './attendance.dto';
import { AttendanceService } from './attendance.service';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    create(createAttendanceDto: CreateAttendanceDto): Promise<{
        message: string;
    }>;
    findAll(userId?: string, status?: string, date?: string, startDate?: string, endDate?: string): Promise<any[]>;
    getAttendancesByUser(userId: string, status?: string, startDate?: string, endDate?: string): Promise<any[]>;
    getAttendanceByUserAndDate(userId: string, date: string): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<Partial<import("../../common/schemas/attendance.schema").Attendance>>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=attendance.controller.d.ts.map