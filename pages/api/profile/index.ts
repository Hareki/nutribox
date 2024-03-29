import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import type { ChangePasswordDto } from 'backend/dtos/password/changePassword.dto';
import { ChangePasswordDtoSchema } from 'backend/dtos/password/changePassword.dto';
import { UpdateProfileDtoSchema } from 'backend/dtos/profile/profile.dto';
import { getSessionCustomerAccount } from 'backend/helpers/auth2.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { AccountService } from 'backend/services/account/account.service';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { CustomerService } from 'backend/services/customer/customer.service';
import type { CustomerDashboardData } from 'backend/services/customer/helper';
import type { JSFail, JSSuccess } from 'backend/types/jsend';
import type { PopulateAccountFields } from 'models/account.model';
import type { CustomerModel } from 'models/customer.model';

type SuccessResponse = JSSuccess<
  | CustomerDashboardData
  | CustomerModel
  | PopulateAccountFields<'customer' | 'employee'>
>;
type FailResponse = JSFail<CustomerDashboardData | CustomerModel>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<SuccessResponse | FailResponse>
>(DEFAULT_NC_CONFIGS);

handler
  .get(async (req, res) => {
    const account = await getSessionCustomerAccount(req, res);

    const data = await CustomerService.getDashboardInfo(
      account?.customer.id || '',
    );
    res.status(StatusCodes.OK).json({
      status: 'success',
      data,
    });
  })
  // basic information
  .put(createValidationGuard(UpdateProfileDtoSchema), async (req, res) => {
    const account = await getSessionCustomerAccount(req, res);
    const updatedCustomer = await CustomerService.updateProfile(
      account?.customer.id || '',
      req.body,
    );
    res.status(StatusCodes.OK).json({
      status: 'success',
      data: updatedCustomer,
    });
  })
  .patch(createValidationGuard(ChangePasswordDtoSchema), async (req, res) => {
    const account = await getSessionCustomerAccount(req, res);
    const dto = req.body as ChangePasswordDto;

    const updatedCustomer = await AccountService.changePassword(
      account?.id || '',
      dto,
    );

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: updatedCustomer,
    });
  });

export default handler;
