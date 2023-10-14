import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { ForgotPasswordDtoSchema } from 'backend/dtos/forgotPassword.dto';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createSchemaValidationMiddleware } from 'backend/next-connect/nc-middleware';
import { MailerService } from 'backend/services/mailer/mailer.service';
import type { JSFail, JSSuccess } from 'backend/types/jsend';

type SuccessResponse = JSSuccess<undefined>;
type FailResponse = JSFail<undefined>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<SuccessResponse | FailResponse>
>(DEFAULT_NC_CONFIGS);

handler.post(
  createSchemaValidationMiddleware(ForgotPasswordDtoSchema),
  async (req, res) => {
    const email = req.body.email as string;

    await MailerService.sendResetPasswordEmail(email);
    res.status(StatusCodes.OK).json({
      status: 'success',
      data: undefined,
    });
  },
);

export default handler;
