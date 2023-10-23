import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { CustomerOrderEntity } from 'backend/entities/customerOrder.entity';
import {
  getPaginationParams,
  setPaginationHeader,
} from 'backend/helpers/req.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { CommonService } from 'backend/services/common/common.service';
import type { JSSuccess } from 'backend/types/jsend';
import type { CustomerOrderModel } from 'models/customerOrder.model';

type SuccessResponse = JSSuccess<CustomerOrderModel[]>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler.get(async (req, res) => {
  const paginationParams = getPaginationParams(req);
  const keyword = req.query.keyword as string;

  if (keyword) {
    const data = (await CommonService.getRecordsByKeyword({
      entity: CustomerOrderEntity,

      searchParams: {
        keyword,
        fieldName: 'phone',
        limit: paginationParams.limit,
      },
    })) as CustomerOrderModel[];

    res.status(StatusCodes.OK).json({
      status: 'success',
      data,
    });
  } else {
    const [data, totalRecords] = await CommonService.getRecords({
      entity: CustomerOrderEntity,
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
