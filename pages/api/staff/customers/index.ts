import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { CustomerEntity } from 'backend/entities/customer.entity';
import { CustomerOrderEntity } from 'backend/entities/customerOrder.entity';
import { getRepo } from 'backend/helpers/database.helper';
import {
  getPaginationParams,
  setPaginationHeader,
} from 'backend/helpers/req.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { CommonService } from 'backend/services/common/common.service';
import type { CommonArgs } from 'backend/services/common/helper';
import type { CustomerWithTotalOrders } from 'backend/services/customer/helper';
import type { JSSuccess } from 'backend/types/jsend';
import type { CustomerModel } from 'models/customer.model';

type SuccessResponse = JSSuccess<CustomerWithTotalOrders[]>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler.get(async (req, res) => {
  const paginationParams = getPaginationParams(req);
  const keyword = req.query.keyword as string;

  const commonArgs: CommonArgs<CustomerEntity> = {
    entity: CustomerEntity,
  };

  const customerOrderRepo = await getRepo(CustomerOrderEntity);

  if (keyword) {
    const customers = (await CommonService.getRecordsByKeyword({
      ...commonArgs,
      searchParams: {
        keyword,
        fieldName: 'name',
        limit: paginationParams.limit,
      },
    })) as CustomerModel[];

    const customersWithTotalOrders = await Promise.all(
      customers.map(async (customer) => {
        const totalOrders = await customerOrderRepo.count({
          where: {
            customer: customer.id,
          },
        });

        return {
          ...customer,
          totalOrders,
        };
      }),
    );

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: customersWithTotalOrders,
    });
  } else {
    const [customers, totalRecords] = await CommonService.getRecords({
      ...commonArgs,
      paginationParams,
    });

    const customersWithTotalOrders = await Promise.all(
      (customers as CustomerModel[]).map(async (customer) => {
        const totalOrders = await customerOrderRepo.count({
          where: {
            customer: customer.id,
          },
        });

        return {
          ...customer,
          totalOrders,
        };
      }),
    );

    setPaginationHeader(res, {
      ...paginationParams,
      totalRecords,
    });

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: customersWithTotalOrders,
    });
  }
});

export default handler;
