import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ErrorHandler, NoMatchHandler } from 'next-connect';

import {
  getDuplicationErrorMessageSQL,
  getValidationErrorMessageSQL,
} from 'api/helpers/schema.helper';
import {
  isDuplicationErrorSQL,
  isValidationErrorSQL,
} from 'api/types/mongooseError.type';
import type {
  JSendErrorResponse,
  JSendFailResponse,
} from 'api/types/response.type';

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

export const onValidationError: ErrorHandler<
  NextApiRequest,
  NextApiResponse<
    JSendFailResponse<Record<string, string>> | JSendErrorResponse
  >
> = (err: any, _req, res) => {
  let response: Record<string, string>;
  console.log(JSON.stringify(err));

  if (isDuplicationErrorSQL(err)) {
    response = getDuplicationErrorMessageSQL(err.message);
  } else if (isValidationErrorSQL(err)) {
    response = getValidationErrorMessageSQL(err.message);
  }

  if (response) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      status: 'fail',
      data: response,
    });
    return;
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: err.message,
  });
};
