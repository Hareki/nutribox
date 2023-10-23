import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import type { CustomerCancelOrderDto } from 'backend/dtos/profile/orders/cancelOrder.dto';
import { CustomerCancelOrderDtoSchema } from 'backend/dtos/profile/orders/cancelOrder.dto';
import { CustomerOrderEntity } from 'backend/entities/customerOrder.entity';
import { getSessionEmployeeAccount } from 'backend/helpers/auth2.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { CommonService } from 'backend/services/common/common.service';
import { CustomerOrderService } from 'backend/services/customerOrder/customerOrder.service';
import { createEmployeeOrderCancellationGuard } from 'backend/services/employee/employee.guard';
import type { JSSuccess } from 'backend/types/jsend';
import type { PopulateCustomerOrderFields } from 'models/customerOrder.model';

type SuccessResponse = JSSuccess<
  PopulateCustomerOrderFields<'customerOrderItems'>
>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler
  .get(async (req, res) => {
    const id = req.query.id as string;
    const data = (await CommonService.getRecord({
      entity: CustomerOrderEntity,
      relations: ['customerOrderItems'],
      filter: {
        id,
      },
    })) as PopulateCustomerOrderFields<'customerOrderItems'>;

    res.status(StatusCodes.OK).json({
      status: 'success',
      data,
    });
  })
  .patch(
    // employees can hit this route are already authenticated
    // createOrderAccessGuard(),
    createEmployeeOrderCancellationGuard(),
    createValidationGuard(CustomerCancelOrderDtoSchema),
    async (req, res) => {
      const account = await getSessionEmployeeAccount(req, res);

      const customerOrderId = req.query.id as string;
      const dto = req.body as CustomerCancelOrderDto;

      const updatedOrder = await CustomerOrderService.cancelOrder(
        customerOrderId,
        account.id,
        dto,
      );

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: updatedOrder,
      });
    },
  );

export default handler;
