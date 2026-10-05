import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { LeaveRecord } from '../users/entities/leave-record.entity';
import { EmployeeAsset } from '../users/entities/employee-asset.entity';

@Injectable()
export class ToolsService {
  constructor(
   @InjectModel(LeaveRecord)
    private readonly leaveRecordModel: typeof LeaveRecord,
    @InjectModel(EmployeeAsset)
    private readonly employeeAssetModel: typeof EmployeeAsset
  ) {}

  async getLeaveBalance(userId: number) {
    const records = await this.leaveRecordModel.findAll({
      where: { user_id: userId },
    });

    return records.map((leave) => ({
      leave_type: leave.leave_type,
      total_days: leave.total_days,
      used_days: leave.used_days,
      remaining_days: leave.total_days - leave.used_days,
    }));
  }

  async getEmployeeAssets(userId: number) {
    return this.employeeAssetModel.findAll({
      where: { user_id: userId },
    });
  }
}