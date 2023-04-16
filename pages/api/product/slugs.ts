import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { getProductSlugs } from 'api/base/server-side-modules';
import connectToDB from 'api/database/databaseConnection';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<string[]>>>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (_req, res) => {
  await connectToDB();

  const slugs = await getProductSlugs();

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: slugs,
  });
});

export default handler;
