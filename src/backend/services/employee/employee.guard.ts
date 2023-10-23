import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextHandler } from 'next-connect';

import { CommonService } from '../common/common.service';

import {
  EmployeeCancellableOrderStatuses,
  EmployeeUpgradeableOrderStatuses,
} from './helper';

import { CustomerOrderEntity } from 'backend/entities/customerOrder.entity';
import { isEntityNotFoundError } from 'backend/helpers/validation.helper';
import { getNextOrderStatusId } from 'helpers/order.helper';

export const createEmployeeOrderCancellationGuard =
  () =>
  async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const customerOrderId = req.query.id as string;
    try {
      const customerOrder = await CommonService.getRecord({
        entity: CustomerOrderEntity,
        filter: {
          id: customerOrderId,
        },
      });

      if (!EmployeeCancellableOrderStatuses.includes(customerOrder.status)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: 'fail',
          message: 'CustomerOrder.NotCancellable.Employee',
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

export const createEmployeeOrderStatusUpgradeGuard =
  () =>
  async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const customerOrderId = req.query.id as string;
    try {
      const customerOrder = await CommonService.getRecord({
        entity: CustomerOrderEntity,
        filter: {
          id: customerOrderId,
        },
      });

      if (!EmployeeUpgradeableOrderStatuses.includes(customerOrder.status)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: 'fail',
          message: 'CustomerOrder.NotUpgradeable.Employee',
        });
      }

      req.body = {
        nextStatus: getNextOrderStatusId(customerOrder.status),
      };

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
