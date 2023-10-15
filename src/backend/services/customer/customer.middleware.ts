import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextHandler } from 'next-connect';

import { CommonService } from '../common/common.service';

import { CustomerAddressEntity } from 'backend/entities/customerAddress.entity';
import { getSessionAccount } from 'backend/utils/auth2.helper';
import { isEntityNotFoundError } from 'backend/utils/validation.helper';
import { ADDRESS_DETAIL_API_ROUTE } from 'constants/routes.api.constant';
import { matchesRoute } from 'utils/middleware.helper';

export const createAddressAuthorizationMiddleware =
  () =>
  async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const account = await getSessionAccount(req, res);
    const addressId = req.query.id as string;
    try {
      const address = await CommonService.getRecord({
        entity: CustomerAddressEntity,
        filter: {
          id: addressId,
          customer: {
            id: account?.customer.id || '',
          },
        },
      });

      if (
        matchesRoute(req.url || '', ADDRESS_DETAIL_API_ROUTE, true) &&
        req.method === 'GET'
      ) {
        return res.status(StatusCodes.OK).json({
          status: 'success',
          data: address,
        });
      }

      return next();
    } catch (error) {
      if (isEntityNotFoundError(error)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          status: 'fail',
          message: 'You are not authorized access this address',
        });
      }
      throw error;
    }
  };
