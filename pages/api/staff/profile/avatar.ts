import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { UpdateStaffProfileAvatarDtoSchema } from 'backend/dtos/staffProfile/updateStaffProfile.dto';
import { getSessionEmployeeAccount } from 'backend/helpers/auth2.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { EmployeeService } from 'backend/services/employee/employee.service';
import type { JSSuccess } from 'backend/types/jsend';
import type { PopulateAccountFields } from 'models/account.model';
import type { EmployeeModel } from 'models/employee.model';

type SuccessResponse = JSSuccess<
  EmployeeModel | PopulateAccountFields<'customer' | 'employee'>
>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler.put(
  createValidationGuard(UpdateStaffProfileAvatarDtoSchema),
  async (req, res) => {
    const account = await getSessionEmployeeAccount(req, res);
    const updatedCustomer = await EmployeeService.updateProfile(
      account?.employee.id || '',
      req.body,
    );
    res.status(StatusCodes.OK).json({
      status: 'success',
      data: updatedCustomer,
    });
  },
);
export default handler;
