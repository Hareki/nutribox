import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { NoMatchHandler } from 'next-connect';

// Get executed whenever there's no match for the request method of the request URL
export const defaultNcOnNoMatch: NoMatchHandler<
  NextApiRequest,
  NextApiResponse
> = (req, res) => {
  console.log('=============== NO ROUTE MATCHED ================');
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log('==================================================');

  res
    .status(StatusCodes.METHOD_NOT_ALLOWED)
    .end(`${req.method} ${req.url} not found at Default No Match Handler`);
};
