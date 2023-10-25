import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { UpdateStoreInfoDtoSchema } from 'backend/dtos/store/updateStoreInfo.dto';
import { UpdateStoreWorkTimesDtoSchema } from 'backend/dtos/store/updateStoreWorkTimes.dto';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { createUniqueDaysOfWeekGuard } from 'backend/services/store/store.guard';
import { StoreService } from 'backend/services/store/store.service';
import { DuplicationError } from 'backend/types/errors/common';
import type { JSSuccess } from 'backend/types/jsend';
import type { PopulateStoreFields, StoreModel } from 'models/store.model';

type SuccessResponse = JSSuccess<
  PopulateStoreFields<'storeWorkTimes'> | StoreModel
>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler
  .get(async (req, res) => {
    const id = req.query.id as string;
    const data = await StoreService.getStoreInfoAndWorkTimes(id);
    res.status(StatusCodes.OK).json({
      status: 'success',
      data,
    });
  })
  .patch(createValidationGuard(UpdateStoreInfoDtoSchema), async (req, res) => {
    try {
      const id = req.query.id as string;
      const dto = req.body;

      const updatedStore = await StoreService.updateStoreInfo(id, dto);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: updatedStore,
      });
    } catch (error) {
      if (error.message.includes('UQ_STORE_EMAIL')) {
        throw new DuplicationError('name', 'Store.Email.Duplicate');
      }
      if (error.message.includes('UQ_STORE_PHONE')) {
        throw new DuplicationError('phone', 'Store.Phone.Duplicate');
      }
      throw error;
    }
  })
  .put(
    createValidationGuard(UpdateStoreWorkTimesDtoSchema),
    createUniqueDaysOfWeekGuard(),
    async (req, res) => {
      const id = req.query.id as string;
      const dto = req.body;

      const updatedStore = await StoreService.updateStoreWorkTimes(id, dto);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: updatedStore,
      });
    },
  );

export default handler;
