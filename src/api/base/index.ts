import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import { ErrorHandler, NoMatchHandler } from 'next-connect';

// Get executed whenever middlewares throw errors
export const defaultOnError: ErrorHandler<NextApiRequest, NextApiResponse> = (
  err: Error,
  _,
  res,
) => {
  const responseCode = StatusCodes.INTERNAL_SERVER_ERROR;
  console.log(err.message);
  console.log(err.stack);
  res.status(responseCode).end(getReasonPhrase(responseCode));
};

// Get executed whenever there's no match for the request method of the request URL
export const defaultOnNoMatch: NoMatchHandler<
  NextApiRequest,
  NextApiResponse
> = (req, res) => {
  res.status(StatusCodes.BAD_REQUEST).end(`${req.method} ${req.url} not found`);
};
