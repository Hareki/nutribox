import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextHandler } from 'next-connect';

import { CommonService } from '../common/common.service';

import { CustomerCancellableOrderStatuses } from './helper';

import { CustomerAddressEntity } from 'backend/entities/customerAddress.entity';
import { CustomerOrderEntity } from 'backend/entities/customerOrder.entity';
import { getSessionAccount } from 'backend/helpers/auth2.helper';
import { isEntityNotFoundError } from 'backend/helpers/validation.helper';
import {
  ADDRESS_DETAIL_API_ROUTE,
  ORDER_DETAIL_API_ROUTE,
} from 'constants/routes.api.constant';
import { matchesPlaceHolderRoute } from 'utils/middleware.helper';

export const createAddressAccessGuard =
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
        matchesPlaceHolderRoute(
          req.url || '',
          ADDRESS_DETAIL_API_ROUTE,
          true,
        ) &&
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

export const createOrderAccessGuard =
  () =>
  async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const account = await getSessionAccount(req, res);
    const customerOrderId = req.query.id as string;
    try {
      const customerOrder = await CommonService.getRecord({
        entity: CustomerOrderEntity,
        filter: {
          id: customerOrderId,
          customer: {
            id: account?.customer.id || '',
          },
        },
        relations: ['customerOrderItems'],
      });

      if (
        matchesPlaceHolderRoute(req.url || '', ORDER_DETAIL_API_ROUTE, true) &&
        req.method === 'GET'
      ) {
        return res.status(StatusCodes.OK).json({
          status: 'success',
          data: customerOrder,
        });
      }

      return next();
    } catch (error) {
      if (isEntityNotFoundError(error)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          status: 'fail',
          message: 'You are not authorized access this customer order',
        });
      }
      throw error;
    }
  };

export const createOrderCancellingGuard =
  () =>
  async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const account = await getSessionAccount(req, res);
    const customerOrderId = req.query.id as string;
    try {
      const customerOrder = await CommonService.getRecord({
        entity: CustomerOrderEntity,
        filter: {
          id: customerOrderId,
          customer: {
            id: account?.customer.id || '',
          },
        },
      });

      if (!CustomerCancellableOrderStatuses.includes(customerOrder.status)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: 'fail',
          message: 'CustomerOrder.NotCancellable.Client',
        });
      }

      return next();
    } catch (error) {
      if (isEntityNotFoundError(error)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          status: 'fail',
          message: 'You are not authorized access this customer order',
        });
      }
      throw error;
    }
  };
