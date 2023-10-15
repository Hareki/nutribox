import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import type { NewCustomerAddressDto } from 'backend/dtos/profile/addresses/newCustomerAddress.dto';
import { NewCustomerAddressDtoSchema } from 'backend/dtos/profile/addresses/newCustomerAddress.dto';
import { CustomerAddressEntity } from 'backend/entities/customerAddress.entity';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createSchemaValidationMiddleware } from 'backend/next-connect/nc-middleware';
import { CommonService } from 'backend/services/common/common.service';
import { CustomerService } from 'backend/services/customer/customer.service';
import type { JSSuccess } from 'backend/types/jsend';
import { getSessionAccount } from 'backend/utils/auth2.helper';
import type { CustomerAddressModel } from 'models/customerAddress.model';

type SuccessResponse = JSSuccess<CustomerAddressModel[] | CustomerAddressModel>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler
  .get(async (req, res) => {
    const account = await getSessionAccount(req, res);

    const data = await CustomerService.getAddresses(account?.customer.id || '');
    res.status(StatusCodes.OK).json({
      status: 'success',
      data,
    });
  })
  .post(
    createSchemaValidationMiddleware(NewCustomerAddressDtoSchema),
    async (req, res) => {
      const dto = req.body as NewCustomerAddressDto;
      const address = (await CommonService.createRecord(
        CustomerAddressEntity,
        dto,
      )) as CustomerAddressModel;

      res.status(StatusCodes.CREATED).json({
        status: 'success',
        data: address,
      });
    },
  );

export default handler;
