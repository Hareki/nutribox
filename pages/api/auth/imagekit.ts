import { StatusCodes } from 'http-status-codes';
import ImageKit from 'imagekit';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnNoMatch } from 'api/base/next-connect';

interface ImageKitAuthParams {
  token: string;
  expire: number;
  signature: string;
}

const imagekit = new ImageKit({
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT_URL,
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

const handler = nc<NextApiRequest, NextApiResponse<ImageKitAuthParams>>({
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  const authParams: ImageKitAuthParams = imagekit.getAuthenticationParameters();
  res.status(StatusCodes.OK).json(authParams);
});

export default handler;
