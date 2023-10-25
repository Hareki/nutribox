import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { UpdateSupplierDtoSchema } from 'backend/dtos/suppliers/updateSupplier.dto';
import { SupplierEntity } from 'backend/entities/supplier.entity';
import { isDuplicateError } from 'backend/helpers/validation.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { CommonService } from 'backend/services/common/common.service';
import { DuplicationError } from 'backend/types/errors/common';
import type { JSSuccess } from 'backend/types/jsend';
import type { SupplierModel } from 'models/supplier.model';

type SuccessResponse = JSSuccess<SupplierModel>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler
  .get(async (req, res) => {
    const id = req.query.id as string;
    const data = (await CommonService.getRecord({
      entity: SupplierEntity,
      filter: {
        id,
      },
    })) as SupplierModel;

    res.status(StatusCodes.OK).json({
      status: 'success',
      data,
    });
  })
  .put(createValidationGuard(UpdateSupplierDtoSchema), async (req, res) => {
    try {
      const id = req.query.id as string;
      const updatedProduct = (await CommonService.updateRecord(
        SupplierEntity,
        id,
        req.body,
      )) as SupplierModel;

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: updatedProduct,
      });
    } catch (error) {
      if (isDuplicateError(error)) {
        if (error.message.includes('UQ_SUPPLIER_NAME')) {
          throw new DuplicationError('name', 'Supplier.Name.Duplicate');
        }
        if (error.message.includes('UQ_SUPPLIER_PHONE')) {
          throw new DuplicationError('phone', 'Supplier.Phone.Duplicate');
        }
        if (error.message.includes('UQ_SUPPLIER_EMAIL')) {
          throw new DuplicationError('email', 'Supplier.Email.Duplicate');
        }
      }
      throw error;
    }
  });

export default handler;
