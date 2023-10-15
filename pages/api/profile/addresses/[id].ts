import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import type { UpdateCustomerAddressDto } from 'backend/dtos/profile/addresses/updateCustomerAddress.dto';
import { UpdateCustomerAddressDtoSchema } from 'backend/dtos/profile/addresses/updateCustomerAddress.dto';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createSchemaValidationMiddleware } from 'backend/next-connect/nc-middleware';
import { createAddressAccessGuard } from 'backend/services/customer/customer.middleware';
import { CustomerAddressService } from 'backend/services/customerAddress/customerAddress.service';
import type { JSSuccess } from 'backend/types/jsend';
import { getSessionAccount } from 'backend/utils/auth2.helper';
import type { CustomerAddressModel } from 'models/customerAddress.model';

type SuccessResponse = JSSuccess<CustomerAddressModel | undefined>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler
  .get(createAddressAccessGuard())
  .put(
    createAddressAccessGuard(),
    createSchemaValidationMiddleware(UpdateCustomerAddressDtoSchema),
    async (req, res) => {
      const account = await getSessionAccount(req, res);

      const id = req.query.id as string;
      const dto = req.body as UpdateCustomerAddressDto;

      const address = await CustomerAddressService.updateAddress(
        id,
        account.customer.id,
        dto,
      );

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: address,
      });
    },
  )
  .delete(createAddressAccessGuard(), async (req, res) => {
    const account = await getSessionAccount(req, res);
    const id = req.query.id as string;
    await CustomerAddressService.deleteAddress(id, account.customer.id);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: undefined,
    });
  });

export default handler;
