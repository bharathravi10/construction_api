import { Model } from 'mongoose';
import { Attendance, AttendanceDocument } from '../../common/schemas/attendance.schema';
import { UserDocument } from '../../common/schemas/user.schema';
import { CreateAttendanceDto, UpdateAttendanceDto } from './attendance.dto';
export declare class AttendanceService {
    private readonly attendanceModel;
    private readonly userModel;
    private readonly logger;
    constructor(attendanceModel: Model<AttendanceDocument>, userModel: Model<UserDocument>);
    private handleError;
    private validateUser;
    private validateAttendanceData;
    private findAttendanceById;
    private populateAttendanceDetails;
    private populateAttendancesDetails;
    private prepareAttendanceData;
    create(createAttendanceDto: CreateAttendanceDto): Promise<{
        message: string;
    }>;
    findAll(filters?: {
        userId?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
        date?: string;
    }): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<Partial<Attendance>>;
    softDelete(id: string): Promise<{
        message: string;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
    getAttendanceByUserAndDate(userId: string, date: string): Promise<any>;
    getAttendancesByUser(userId: string, filters?: {
        status?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<any[]>;
}
//# sourceMappingURL=attendance.service.d.ts.map