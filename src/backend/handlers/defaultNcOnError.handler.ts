import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ErrorHandler } from 'next-connect';

import type { JSError } from 'backend/types/jsend';

// Get executed whenever middlewares or main handlers throw errors
export const defaultNcOnError: ErrorHandler<
  NextApiRequest,
  NextApiResponse<JSError>
> = (err: Error, req, res) => {
  const responseCode = StatusCodes.INTERNAL_SERVER_ERROR;

  // if (!err.message.startsWith('No repository for')) {
  console.log('=============== UNEXPECTED ERROR ================');
  console.log(err.message);
  console.log(err.stack);
  console.log('=================================================');
  // }

  res.status(responseCode).json({
    status: 'error',
    message: err.message,
    code: responseCode,
  });
};
