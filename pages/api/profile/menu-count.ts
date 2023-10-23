import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { getSessionCustomerAccount } from 'backend/helpers/auth2.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { CustomerService } from 'backend/services/customer/customer.service';
import type { ProfileMenuCount } from 'backend/services/customer/helper';
import type { JSSuccess } from 'backend/types/jsend';

type SuccessResponse = JSSuccess<ProfileMenuCount>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler.get(async (req, res) => {
  const account = await getSessionCustomerAccount(req, res);

  const data = await CustomerService.getMenuCount(account?.customer.id || '');
  res.status(StatusCodes.OK).json({
    status: 'success',
    data,
  });
});

export default handler;
