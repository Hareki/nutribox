import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import type { JSSuccess } from 'backend/types/jsend';

type SuccessResponse = JSSuccess<number>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler.get(async (req, res) => {
  const vnd = req.query.vnd;
  // const requestUrl = `${process.env.EXCHANGE_RATE_API_URL}/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`;
  // const response = await axios.get(requestUrl);
  // const conversionRate = response.data.conversion_rates.VND + 1000;

  // 1 VND =  0.000042 USD
  const conversionRate = 23809.5238095238;
  const usdPrice = Number(vnd) / conversionRate;
  const roundedPrice = Math.ceil(usdPrice * 100) / 100;

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: roundedPrice,
  });
});

export default handler;
