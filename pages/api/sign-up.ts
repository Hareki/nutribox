import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { SignUpDtoSchema } from 'backend/dtos/signUp.dto';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createSchemaValidationMiddleware } from 'backend/next-connect/nc-middleware';
import { AccountService } from 'backend/services/account/account.service';
import { MailerService } from 'backend/services/mailer/mailer.service';
import type { AccountWithPopulatedSide } from 'backend/types/auth';
import type { JSFail, JSSuccess } from 'backend/types/jsend';

type SuccessResponse = JSSuccess<AccountWithPopulatedSide<'customer'>>;
type FailResponse = JSFail<AccountWithPopulatedSide<'customer'>>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<SuccessResponse | FailResponse>
>(DEFAULT_NC_CONFIGS);

handler.post(
  createSchemaValidationMiddleware(SignUpDtoSchema),
  async (req, res) => {
    const data = await AccountService.createCustomerAccount(req.body);
    await MailerService.sendVerificationEmail(data.email);

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data,
    });
  },
);

export default handler;
