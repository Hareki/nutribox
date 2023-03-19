import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/databaseConnection';
import type { DeliveryInfo } from 'api/helpers/address.helper';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<DeliveryInfo>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();
  const { address1, address2 } = req.query;

  // const { distance, durationInTraffic, heavyTraffic } = await getDeliveryInfo(
  //   address1 as string,
  //   address2 as string,
  // );

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      distance: 3.44,
      durationInTraffic: 4.123,
      heavyTraffic: true,
    },
  });
});

export default handler;