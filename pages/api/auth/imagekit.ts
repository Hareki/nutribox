import { StatusCodes } from 'http-status-codes';
import ImageKit from 'imagekit';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';

interface ImageKitAuthParams {
  token: string;
  expire: number;
  signature: string;
}

const imagekit = new ImageKit({
  urlEndpoint: process.env.NEXT_PUBLIC_IK_ENDPOINT_URL,
  publicKey: process.env.NEXT_PUBLIC_IK_PUBLIC_KEY,
  privateKey: process.env.IK_PRIVATE_KEY,
});

const handler = nc<NextApiRequest, NextApiResponse<ImageKitAuthParams>>(
  DEFAULT_NC_CONFIGS,
).get(async (req, res) => {
  const authParams: ImageKitAuthParams = imagekit.getAuthenticationParameters();
  res.status(StatusCodes.OK).json(authParams);
});

export default handler;
