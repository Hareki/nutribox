import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/databaseConnection';
import { getDistanceAndEstimatedTime } from 'api/helpers/address.helper';
import type { JSendResponse } from 'api/types/response.type';

interface DistanceAndEstimatedTime {
  distance: number;
  estimatedTime: number;
}

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<DistanceAndEstimatedTime>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();
  const { address1, address2 } = req.query;

  const { distance, duration } = await getDistanceAndEstimatedTime(
    address1 as string,
    address2 as string,
  );

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      distance,
      estimatedTime: duration,
    },
  });
});

export default handler;
