import { CommonService } from '../common/common.service';

import type { UpdateStaffProfileDto } from 'backend/dtos/staffProfile/updateStaffProfile.dto';
import { EmployeeEntity } from 'backend/entities/employee.entity';
import type { EmployeeModel } from 'models/employee.model';

export class EmployeeService {
  public static async updateProfile(
    id: string,
    dto: UpdateStaffProfileDto,
  ): Promise<EmployeeModel> {
    const updatedCustomer = (await CommonService.updateRecord(
      EmployeeEntity,
      id,
      dto,
    )) as EmployeeModel;

    return updatedCustomer;
  }
}
