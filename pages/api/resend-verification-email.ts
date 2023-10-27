import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { ResendVerificationEmailDtoSchema } from 'backend/dtos/resendVerificationEmail';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { MailerService } from 'backend/services/mailer/mailer.service';
import type { JSSuccess } from 'backend/types/jsend';

type SuccessResponse = JSSuccess<undefined>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler.post(
  createValidationGuard(ResendVerificationEmailDtoSchema),
  async (req, res) => {
    const email = req.body.email as string;
    await MailerService.sendVerificationEmail(email);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: undefined,
    });
  },
);

export default handler;
