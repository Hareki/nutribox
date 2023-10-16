import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import type { CustomerCancelOrderDto } from 'backend/dtos/profile/orders/cancelOrder.dto';
import { CustomerCancelOrderDtoSchema } from 'backend/dtos/profile/orders/cancelOrder.dto';
import { CustomerOrderEntity } from 'backend/entities/customerOrder.entity';
import { OrderStatus } from 'backend/enums/entities.enum';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { CommonService } from 'backend/services/common/common.service';
import {
  createOrderAccessGuard,
  createOrderCancellingGuard,
} from 'backend/services/customer/customer.guard';
import type { JSSuccess } from 'backend/types/jsend';
import { getSessionAccount } from 'backend/helpers/auth2.helper';
import type { CustomerOrderModel } from 'models/customerOrder.model';

type SuccessResponse = JSSuccess<CustomerOrderModel[] | CustomerOrderModel>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler
  .get(createOrderAccessGuard())
  // Cancel order
  .patch(
    createOrderAccessGuard(),
    createOrderCancellingGuard(),
    createValidationGuard(CustomerCancelOrderDtoSchema),
    async (req, res) => {
      const account = await getSessionAccount(req, res);

      const id = req.query.id as string;
      const dto = req.body as CustomerCancelOrderDto;

      const updatedOrder = (await CommonService.updateRecord(
        CustomerOrderEntity,
        id,
        {
          status: OrderStatus.CANCELLED,
          cancellationReason: dto.cancellationReason,
          updatedBy: account?.customer.id,
        },
      )) as CustomerOrderModel;

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: updatedOrder,
      });
    },
  );

export default handler;
