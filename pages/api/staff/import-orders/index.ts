import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { ImportOrderEntity } from 'backend/entities/importOrder.entity';
import {
  getPaginationParams,
  setPaginationHeader,
} from 'backend/helpers/req.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { CommonService } from 'backend/services/common/common.service';
import type { CommonArgs } from 'backend/services/common/helper';
import type { JSSuccess } from 'backend/types/jsend';
import type { PopulateImportOrderFields } from 'models/importOder.model';

type SuccessResponse = JSSuccess<PopulateImportOrderFields<'supplier'>[]>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler.get(async (req, res) => {
  const productId = req.query.productId as string;
  const paginationParams = getPaginationParams(req);

  const commonArgs: CommonArgs<ImportOrderEntity> = {
    entity: ImportOrderEntity,
    relations: ['supplier'],
    filter: {
      product: productId,
    },
  };

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
    data: data as PopulateImportOrderFields<'supplier'>[],
  });
});

export default handler;
