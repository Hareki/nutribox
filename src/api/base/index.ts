import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import { ErrorHandler, NoMatchHandler } from 'next-connect';

import { JSendErrorResponse } from 'api/types/response.type';

// Get executed whenever middlewares or main handlers throw errors
export const defaultOnError: ErrorHandler<
  NextApiRequest,
  NextApiResponse<JSendErrorResponse>
> = (err: Error, _, res) => {
  const responseCode = StatusCodes.INTERNAL_SERVER_ERROR;
  console.log('=====================');
  console.log(err.message);
  console.log(err.stack);
  console.log('=====================');
  res.status(responseCode).json({
    status: 'error',
    message: getReasonPhrase(responseCode),
    code: responseCode,
  });
};

// Get executed whenever there's no match for the request method of the request URL
export const defaultOnNoMatch: NoMatchHandler<
  NextApiRequest,
  NextApiResponse
> = (req, res) => {
  res.status(StatusCodes.BAD_REQUEST).end(`${req.method} ${req.url} not found`);
};
