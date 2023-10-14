import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import type { ChangePasswordDto } from 'backend/dtos/changePassword.dto';
import { ChangePasswordDtoSchema } from 'backend/dtos/changePassword.dto';
import { UpdateProfileDtoSchema } from 'backend/dtos/profile.dto';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createSchemaValidationMiddleware } from 'backend/next-connect/nc-middleware';
import { AccountService } from 'backend/services/account/account.service';
import { CustomerService } from 'backend/services/customer/customer.service';
import type { DashboardInfo } from 'backend/services/customer/helper';
import type { JSFail, JSSuccess } from 'backend/types/jsend';
import { getSessionAccount } from 'backend/utils/auth2.helper';
import type { PopulateAccountFields } from 'models/account.model';
import type { CustomerModel } from 'models/customer.model';

type SuccessResponse = JSSuccess<
  DashboardInfo | CustomerModel | PopulateAccountFields<'customer' | 'employee'>
>;
type FailResponse = JSFail<DashboardInfo | CustomerModel>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<SuccessResponse | FailResponse>
>(DEFAULT_NC_CONFIGS);

handler
  .get(async (req, res) => {
    const account = await getSessionAccount(req, res);

    const data = await CustomerService.getProfileInfo(
      account?.customer.id || '',
    );
    res.status(StatusCodes.OK).json({
      status: 'success',
      data,
    });
  })
  // basic information
  .put(
    createSchemaValidationMiddleware(UpdateProfileDtoSchema),
    async (req, res) => {
      const account = await getSessionAccount(req, res);
      const updatedCustomer = await CustomerService.updateProfile(
        account?.customer.id || '',
        req.body,
      );
      res.status(StatusCodes.OK).json({
        status: 'success',
        data: updatedCustomer,
      });
    },
  )
  .patch(
    createSchemaValidationMiddleware(ChangePasswordDtoSchema),
    async (req, res) => {
      const account = await getSessionAccount(req, res);
      const dto = req.body as ChangePasswordDto;

      const updatedCustomer = await AccountService.changePassword(
        account?.id || '',
        dto,
      );

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: updatedCustomer,
      });
    },
  );

export default handler;
