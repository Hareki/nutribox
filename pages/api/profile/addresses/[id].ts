import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import type { UpdateCustomerAddressDto } from 'backend/dtos/profile/addresses/updateCustomerAddress.dto';
import { UpdateCustomerAddressDtoSchema } from 'backend/dtos/profile/addresses/updateCustomerAddress.dto';
import { getSessionAccount } from 'backend/helpers/auth2.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { createAddressAccessGuard } from 'backend/services/customer/customer.guard';
import { CustomerAddressService } from 'backend/services/customerAddress/customerAddress.service';
import type { JSSuccess } from 'backend/types/jsend';
import type { CustomerAddressModel } from 'models/customerAddress.model';

type SuccessResponse = JSSuccess<CustomerAddressModel[]>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler
  .get(createAddressAccessGuard())
  .put(
    createAddressAccessGuard(),
    createValidationGuard(UpdateCustomerAddressDtoSchema),
    async (req, res) => {
      const account = await getSessionAccount(req, res);

      const id = req.query.id as string;
      const dto = req.body as UpdateCustomerAddressDto;

      await CustomerAddressService.updateAddress(id, account.customer.id, dto);

      const data = await CustomerAddressService.getAddresses(
        account.customer.id,
      );

      res.status(StatusCodes.OK).json({
        status: 'success',
        data,
      });
    },
  )
  .delete(createAddressAccessGuard(), async (req, res) => {
    const account = await getSessionAccount(req, res);
    const id = req.query.id as string;
    await CustomerAddressService.deleteAddress(id, account.customer.id);

    const data = await CustomerAddressService.getAddresses(account.customer.id);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data,
    });
  });

export default handler;
