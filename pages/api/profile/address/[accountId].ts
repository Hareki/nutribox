import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import AccountController from 'api/controllers/Account.controller';
import connectToDB from 'api/database/databaseConnection';
import type { IAccountAddress } from 'api/models/Account.model/AccountAddress.schema/types';
import type { JSendResponse } from 'api/types/response.type';

export interface AddAddressRequestBody
  extends Omit<IAccountAddress, '_id' | 'id'> {}

export interface UpdateAddressRequestBody extends AddAddressRequestBody {
  id: string;
}

export interface DeleteAddressQueryParams {
  addressId: string;
}

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<IAccountAddress[]>>
>({
  attachParams: true,
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
})
  .get(async (req, res) => {
    await connectToDB();

    const id = req.query.accountId as string;
    const accountAddress = await AccountController.getAddresses(id);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: accountAddress,
    });
  })
  .post(async (req, res) => {
    await connectToDB();
    const requestBody = req.body as AddAddressRequestBody;
    const id = req.query.accountId as string;
    const updatedAddresses = await AccountController.addAddress(
      id,
      requestBody,
    );

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: updatedAddresses,
    });
  })
  .put(async (req, res) => {
    await connectToDB();
    const requestBody = req.body as UpdateAddressRequestBody;
    const id = req.query.accountId as string;
    const updatedAddresses = await AccountController.updateAddress(
      id,
      requestBody,
    );

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: updatedAddresses,
    });
  })
  .delete(async (req, res) => {
    await connectToDB();
    const { addressId } = req.query;
    const id = req.query.accountId as string;
    const updatedAddresses = await AccountController.deleteAddress(id, {
      addressId: addressId as string,
    });

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: updatedAddresses,
    });
  });

export default handler;
