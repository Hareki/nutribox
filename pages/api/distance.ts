import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/mongoose/databaseConnection';
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
  console.log('file: distance.ts:20 - address2:', address2);
  console.log('file: distance.ts:20 - address1:', address1);

  // const deliveryInfo = await getDeliveryInfo(
  //   address1 as string,
  //   address2 as string,
  // );
  // console.log('file: distance.ts:26 - deliveryInfo:', deliveryInfo);

  // res.status(StatusCodes.OK).json({
  //   status: 'success',
  //   data: deliveryInfo,
  // });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      distance: 9.44,
      durationInTraffic: 4.123,
      heavyTraffic: true,
    },
  });
});

export default handler;
