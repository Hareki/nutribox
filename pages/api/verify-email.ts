import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { VerifyPasswordDtoSchema } from 'backend/dtos/verifyEmail.dto';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { AccountService } from 'backend/services/account/account.service';
import type { AccountWithPopulatedSide } from 'backend/types/auth';
import type { JSFail, JSSuccess } from 'backend/types/jsend';

type SuccessResponse = JSSuccess<AccountWithPopulatedSide<'customer'>>;
type FailResponse = JSFail<AccountWithPopulatedSide<'customer'>>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<SuccessResponse | FailResponse>
>(DEFAULT_NC_CONFIGS);

handler.post(
  createValidationGuard(VerifyPasswordDtoSchema),
  async (req, res) => {
    const token = req.body.verificationToken as string;

    const data = await AccountService.verifyCustomerEmail(token);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data,
    });
  },
);

export default handler;
