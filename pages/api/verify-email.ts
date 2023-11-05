import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { VerifyCustomerEmailDtoSchema } from 'backend/dtos/verifyCustomerEmail.dto';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { AccountService } from 'backend/services/account/account.service';
import { createValidationGuard } from 'backend/services/common/common.guard';
import type { JSSuccess } from 'backend/types/jsend';
import type { FullyPopulatedAccountModel } from 'models/account.model';

type SuccessResponse = JSSuccess<FullyPopulatedAccountModel>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler.post(
  createValidationGuard(VerifyCustomerEmailDtoSchema),
  async (req, res) => {
    const token = req.body.verificationToken as string;
    const data = await AccountService.verifyEmail(token);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data,
    });
  },
);

export default handler;
