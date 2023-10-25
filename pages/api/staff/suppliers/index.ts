import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { NewSupplierDtoSchema } from 'backend/dtos/suppliers/newSupplier.dto';
import { SupplierEntity } from 'backend/entities/supplier.entity';
import { getRepo } from 'backend/helpers/database.helper';
import {
  getPaginationParams,
  setPaginationHeader,
} from 'backend/helpers/req.helper';
import { isDuplicateError } from 'backend/helpers/validation.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { CommonService } from 'backend/services/common/common.service';
import type { CommonArgs } from 'backend/services/common/helper';
import type { SupplierDropDown } from 'backend/services/supplier/helper';
import { DuplicationError } from 'backend/types/errors/common';
import type { JSSuccess } from 'backend/types/jsend';
import type { SupplierModel } from 'models/supplier.model';

type SuccessResponse = JSSuccess<
  SupplierModel[] | SupplierModel | SupplierDropDown[]
>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler
  .get(async (req, res) => {
    const paginationParams = getPaginationParams(req);
    const keyword = req.query.keyword as string;
    const dropdown = req.query.dropdown as string;

    const commonArgs: CommonArgs<SupplierEntity> = {
      entity: SupplierEntity,
    };

    if (dropdown) {
      const supplierRepo = await getRepo(SupplierEntity);
      const data = (await supplierRepo.find({
        select: ['id', 'name'],
      })) as SupplierDropDown[];

      res.status(StatusCodes.OK).json({
        status: 'success',
        data,
      });

      return;
    }

    if (keyword) {
      const data = (await CommonService.getRecordsByKeyword({
        ...commonArgs,
        searchParams: {
          keyword,
          fieldName: 'name',
          limit: paginationParams.limit,
        },
      })) as SupplierModel[];

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
        data: data as SupplierModel[],
      });
    }
  })
  .post(createValidationGuard(NewSupplierDtoSchema), async (req, res) => {
    try {
      const result = (await CommonService.createRecord(
        SupplierEntity,
        req.body,
      )) as SupplierModel;
      res.status(StatusCodes.CREATED).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      if (isDuplicateError(error)) {
        throw new DuplicationError('name', 'Supplier.Name.Duplicate');
      }
      throw error;
    }
  });

export default handler;
