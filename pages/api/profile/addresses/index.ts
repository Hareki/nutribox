import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import type { NewCustomerAddressDto } from 'backend/dtos/profile/addresses/newCustomerAddress.dto';
import { NewCustomerAddressDtoSchema } from 'backend/dtos/profile/addresses/newCustomerAddress.dto';
import { getSessionAccount } from 'backend/helpers/auth2.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { CustomerAddressService } from 'backend/services/customerAddress/customerAddress.service';
import type { JSSuccess } from 'backend/types/jsend';
import type { CustomerAddressModel } from 'models/customerAddress.model';

type SuccessResponse = JSSuccess<CustomerAddressModel[]>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler
  .get(async (req, res) => {
    const account = await getSessionAccount(req, res);

    const data = await CustomerAddressService.getAddresses(
      account?.customer.id || '',
    );
    res.status(StatusCodes.OK).json({
      status: 'success',
      data,
    });
  })
  .post(
    createValidationGuard(NewCustomerAddressDtoSchema),
    async (req, res) => {
      const account = await getSessionAccount(req, res);

      const dto = req.body as NewCustomerAddressDto;

      await CustomerAddressService.addAddress(account.customer.id, dto);

      const data = await CustomerAddressService.getAddresses(
        account?.customer.id || '',
      );
      res.status(StatusCodes.CREATED).json({
        status: 'success',
        data,
      });
    },
  );

export default handler;
