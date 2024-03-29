import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { UpdateProfileAvatarDtoSchema } from 'backend/dtos/profile/profile.dto';
import { getSessionCustomerAccount } from 'backend/helpers/auth2.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { CustomerService } from 'backend/services/customer/customer.service';
import type { CustomerDashboardData } from 'backend/services/customer/helper';
import type { JSSuccess } from 'backend/types/jsend';
import type { PopulateAccountFields } from 'models/account.model';
import type { CustomerModel } from 'models/customer.model';

type SuccessResponse = JSSuccess<
  | CustomerDashboardData
  | CustomerModel
  | PopulateAccountFields<'customer' | 'employee'>
>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler.put(
  createValidationGuard(UpdateProfileAvatarDtoSchema),
  async (req, res) => {
    const account = await getSessionCustomerAccount(req, res);
    const updatedCustomer = await CustomerService.updateProfile(
      account?.customer.id || '',
      req.body,
    );
    res.status(StatusCodes.OK).json({
      status: 'success',
      data: updatedCustomer,
    });
  },
);
export default handler;
