import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { CustomerOrderEntity } from 'backend/entities/customerOrder.entity';
import { getSessionAccount } from 'backend/helpers/auth2.helper';
import {
  getPaginationParams,
  setPaginationHeader,
} from 'backend/helpers/req.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { CommonService } from 'backend/services/common/common.service';
import type { CommonArgs } from 'backend/services/common/helper';
import type { JSSuccess } from 'backend/types/jsend';
import type { CustomerOrderModel } from 'models/customerOrder.model';

type SuccessResponse = JSSuccess<CustomerOrderModel[] | CustomerOrderModel>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler.get(async (req, res) => {
  const account = await getSessionAccount(req, res);
  const paginationParams = getPaginationParams(req);
  const keyword = req.query.keyword as string;
  const status = req.query.status as string;

  const commonArgs: CommonArgs<CustomerOrderEntity> = {
    entity: CustomerOrderEntity,
    filter: {
      customer: {
        id: account.customer.id,
      },
      ...(status ? { status } : {}),
    },
  };

  if (keyword) {
    const data = (await CommonService.getRecordsByKeyword({
      ...commonArgs,
      searchParams: {
        keyword,
        fieldName: 'id',
        limit: paginationParams.limit,
      },
    })) as CustomerOrderModel[];

    res.status(StatusCodes.OK).json({
      status: 'success',
      data,
    });
  } else {
    const [data, totalRecords] = await CommonService.getRecords({
      ...commonArgs,
      paginationParams,
    });

    setPaginationHeader(res, {
      ...paginationParams,
      totalRecords,
    });

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: data as CustomerOrderModel[],
    });
  }
});

export default handler;
