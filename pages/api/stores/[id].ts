import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { SignUpDtoSchema } from 'backend/dtos/signUp.dto';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { StoreService } from 'backend/services/store/store.service';
import type { JSFail, JSSuccess } from 'backend/types/jsend';
import type { PopulateStoreFields } from 'models/store.model';

type SuccessResponse = JSSuccess<PopulateStoreFields<'storeWorkTimes'>>;
type FailResponse = JSFail<PopulateStoreFields<'storeWorkTimes'>>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<SuccessResponse | FailResponse>
>(DEFAULT_NC_CONFIGS);

handler.post(createValidationGuard(SignUpDtoSchema), async (req, res) => {
  const id = req.query.id as string;
  const data = await StoreService.getStoreInfo(id);
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data,
  });
});

export default handler;
