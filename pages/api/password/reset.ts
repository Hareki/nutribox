import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { ResetPasswordDtoSchema } from 'backend/dtos/password/resetPassword.dto';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { AccountService } from 'backend/services/account/account.service';
import { createValidationGuard } from 'backend/services/common/common.guard';
import type { JSFail, JSSuccess } from 'backend/types/jsend';
import type { FullyPopulatedAccountModel } from 'models/account.model';

type SuccessResponse = JSSuccess<FullyPopulatedAccountModel>;
type FailResponse = JSFail<FullyPopulatedAccountModel>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<SuccessResponse | FailResponse>
>(DEFAULT_NC_CONFIGS);

handler.patch(
  createValidationGuard(ResetPasswordDtoSchema),
  async (req, res) => {
    const token = req.body.forgotPasswordToken as string;
    const password = req.body.password as string;

    const account = await AccountService.resetPassword(token, password);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: account,
    });
  },
);

export default handler;
