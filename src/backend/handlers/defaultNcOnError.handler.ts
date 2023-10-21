import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ErrorHandler } from 'next-connect';
import {
  EntityMetadataNotFoundError,
  EntityNotFoundError,
  RepositoryNotFoundError,
} from 'typeorm';

import { BadRequestError, DuplicationError } from 'backend/types/errors/common';
import type { JSError, JSFail } from 'backend/types/jsend';

// Get executed whenever middlewares or main handlers throw errors
export const defaultNcOnError: ErrorHandler<
  NextApiRequest,
  NextApiResponse<JSError | JSFail<any>>
> = (err: Error, req, res) => {
  let errorCode: number | undefined;
  let data: Record<string, any> | undefined;

  // common caught errors go here
  if (err instanceof DuplicationError) {
    errorCode = StatusCodes.CONFLICT;
    data = { [err.duplicatedField]: err.message };
  }

  // common caught errors go here
  if (err instanceof BadRequestError) {
    errorCode = StatusCodes.BAD_REQUEST;
    data = { [err.badRequestField]: err.message };
  }

  // usually uncaught errors during CRUD go here
  if (err instanceof EntityNotFoundError) {
    errorCode = StatusCodes.NOT_FOUND;
    data = {
      message: err.message,
    };
  }

  if (data && errorCode) {
    res.status(errorCode).json({
      status: 'fail',
      data,
    });

    console.log('=============== COMMON ERROR ================');
    console.log(err.message);
    console.log(err.stack);
    console.log('=================================================');
    return;
  }

  // truly unexpected errors go here
  console.log('=============== UNEXPECTED ERROR ================');
  // errors caused by typeorm and nextjs conflict with each other should be ignored, since they don't really affect anything and only happens in development
  if (
    !(err instanceof RepositoryNotFoundError) ||
    !(err instanceof EntityMetadataNotFoundError)
  ) {
    console.log(err.message);
    console.log(err.stack);
  }
  console.log('=================================================');

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: err.message,
    code: StatusCodes.INTERNAL_SERVER_ERROR,
  });
};
