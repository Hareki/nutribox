import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import type { UpdateCustomerAddressDto } from 'backend/dtos/customerAddress/updateCustomerAddress.dto';
import { UpdateCustomerAddressDtoSchema } from 'backend/dtos/customerAddress/updateCustomerAddress.dto';
import { CustomerAddressEntity } from 'backend/entities/customerAddress.entity';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createSchemaValidationMiddleware } from 'backend/next-connect/nc-middleware';
import { CommonService } from 'backend/services/common/common.service';
import { createAddressAuthorizationMiddleware } from 'backend/services/customer/customer.middleware';
import { CustomerService } from 'backend/services/customer/customer.service';
import type { JSSuccess } from 'backend/types/jsend';
import { getSessionAccount } from 'backend/utils/auth2.helper';
import type { CustomerAddressModel } from 'models/customerAddress.model';

type SuccessResponse = JSSuccess<CustomerAddressModel | undefined>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler
  .get(createAddressAuthorizationMiddleware())
  .put(
    createAddressAuthorizationMiddleware(),
    createSchemaValidationMiddleware(UpdateCustomerAddressDtoSchema),
    async (req, res) => {
      const { id, ...dto } = req.body as UpdateCustomerAddressDto;

      const address = (await CommonService.updateRecord(
        CustomerAddressEntity,
        id,
        dto,
      )) as CustomerAddressModel;

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: address,
      });
    },
  )
  .delete(createAddressAuthorizationMiddleware(), async (req, res) => {
    const account = await getSessionAccount(req, res);
    const id = req.query.id as string;
    await CustomerService.deleteAddress(id, account.customer.id);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: undefined,
    });
  });

export default handler;
