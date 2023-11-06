import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import type { ChangePasswordDto } from 'backend/dtos/password/changePassword.dto';
import { ChangePasswordDtoSchema } from 'backend/dtos/password/changePassword.dto';
import { UpdateStaffProfileDtoSchema } from 'backend/dtos/staffProfile/updateStaffProfile.dto';
import { getSessionEmployeeAccount } from 'backend/helpers/auth2.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { AccountService } from 'backend/services/account/account.service';
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

handler
  .put(createValidationGuard(UpdateStaffProfileDtoSchema), async (req, res) => {
    const account = await getSessionEmployeeAccount(req, res);
    const updatedEmployee = await EmployeeService.updateProfile(
      account?.employee.id || '',
      req.body,
    );
    res.status(StatusCodes.OK).json({
      status: 'success',
      data: updatedEmployee,
    });
  })
  .patch(createValidationGuard(ChangePasswordDtoSchema), async (req, res) => {
    const account = await getSessionEmployeeAccount(req, res);
    const dto = req.body as ChangePasswordDto;

    const updatedEmployee = await AccountService.changePassword(
      account?.id || '',
      dto,
    );

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: updatedEmployee,
    });
  });

export default handler;
