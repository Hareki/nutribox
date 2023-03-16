import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/databaseConnection';
import { JSendResponse } from 'api/types/response.type';
import { CartItemRequestBody } from 'utils/apiCallers/global/cart';

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<null>>>({
  attachParams: true,
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).post(async (req, res) => {
  await connectToDB();
  const requestBody = req.body as CartItemRequestBody;
  const { accountId } = req.query;

  // await AccountController.updateCart(requestBody);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: null,
  });
});

export default handler;
