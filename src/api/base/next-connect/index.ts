import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ErrorHandler, NoMatchHandler } from 'next-connect';

import type { JSendErrorResponse } from 'api/types/response.type';

// Get executed whenever middlewares or main handlers throw errors
export const defaultOnError: ErrorHandler<
NextApiRequest,
NextApiResponse<JSendErrorResponse>
> = (err: Error, req, res) => {
  const responseCode = StatusCodes.INTERNAL_SERVER_ERROR;
  console.log('=====================');
  console.log(err.message);
  console.log(err.stack);
  console.log('=====================');
  res.status(responseCode).json({
    status: 'error',
    message: `${getReasonPhrase(responseCode)} on ${req.method} ${
      req.url
    } at Default Error Handler`,
    code: responseCode,
  });
};

// Get executed whenever there's no match for the request method of the request URL
export const defaultOnNoMatch: NoMatchHandler<
NextApiRequest,
NextApiResponse
> = (req, res) => {
  console.log('=====================');
  console.log('NO MATCH HANDLERS, PLEASE CHECK THE METHOD USED TO CALL AGAIN');
  console.log('=====================');

  res
    .status(StatusCodes.METHOD_NOT_ALLOWED)
    .end(`${req.method} ${req.url} not found at Default No Match Handler`);
};
