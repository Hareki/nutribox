import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import type { NewCustomerAddressDto } from 'backend/dtos/profile/addresses/newCustomerAddress.dto';
import { NewCustomerAddressDtoSchema } from 'backend/dtos/profile/addresses/newCustomerAddress.dto';
import { getSessionCustomerAccount } from 'backend/helpers/auth2.helper';
import { isDuplicateError } from 'backend/helpers/validation.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { CustomerAddressService } from 'backend/services/customerAddress/customerAddress.service';
import { DuplicationError } from 'backend/types/errors/common';
import type { JSSuccess } from 'backend/types/jsend';
import type { CustomerAddressModel } from 'models/customerAddress.model';

type SuccessResponse = JSSuccess<CustomerAddressModel[]>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler
  .get(async (req, res) => {
    const account = await getSessionCustomerAccount(req, res);

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
      try {
        const account = await getSessionCustomerAccount(req, res);

        const dto = req.body as NewCustomerAddressDto;

        await CustomerAddressService.addAddress(account.customer.id, dto);

        const data = await CustomerAddressService.getAddresses(
          account?.customer.id || '',
        );
        res.status(StatusCodes.CREATED).json({
          status: 'success',
          data,
        });
      } catch (error) {
        if (isDuplicateError(error)) {
          throw new DuplicationError(
            'title',
            'CustomerAddress.Title.Duplicate',
          );
        }
        throw error;
      }
    },
  );

export default handler;
