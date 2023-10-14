import { StatusCodes } from 'http-status-codes';
import type { NextApiResponse } from 'next';

import type { AccountEntity } from 'backend/entities/account.entity';
import {
  DuplicationError,
  EntityNotFoundError,
} from 'backend/types/errors/common';
import type { JSFail } from 'backend/types/jsend';

export const handleAccountError = (error: any, res: NextApiResponse) => {
  let errorCode: number | undefined;
  let data: JSFail<AccountEntity>['data'];

  if (error instanceof DuplicationError) {
    errorCode = StatusCodes.CONFLICT;
    data = { email: 'Account.Email.Duplicate' };
  }

  if (error instanceof EntityNotFoundError) {
    console.log('GET HERE 123');
    errorCode = StatusCodes.BAD_REQUEST;
    data = { email: 'Account.VerificationToken.Invalid' };
  }

  if (data && errorCode) {
    res.status(errorCode).json({
      status: 'fail',
      data,
    });
    return;
  }
  throw error;
};
