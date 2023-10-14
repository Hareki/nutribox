import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { VerifyPasswordDtoSchema } from 'backend/dtos/verifyEmail.dto';
import { handleAccountError } from 'backend/handlers/account';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createSchemaValidationMiddleware } from 'backend/next-connect/nc-middleware';
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
  createSchemaValidationMiddleware(VerifyPasswordDtoSchema),
  async (req, res) => {
    const token = req.body.verificationToken as string;

    try {
      const data = await AccountService.verifyCustomerEmail(token);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data,
      });
    } catch (error) {
      handleAccountError(error, res);
    }
  },
);

export default handler;
