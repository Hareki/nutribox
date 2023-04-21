import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
// import type { IAccountAddress } from 'api/models/Account.model/AccountAddress.schema/types';
import { sql } from 'api/database/mssql.config';
import { executeUsp, getAddressParamArray } from 'api/helpers/mssql.helper';
import type { IAccountAddress as IAccountAddressPojo } from 'api/mssql/pojos/account_address.pojo';
import type { JSendResponse } from 'api/types/response.type';

export interface AddAddressRequestBody
  extends Omit<IAccountAddressPojo, '_id' | 'id'> {}

export interface UpdateAddressRequestBody extends AddAddressRequestBody {
  id: string;
}

export interface DeleteAddressQueryParams {
  addressId: string;
}

const convertRequestBodyToParamArray = (requestBody: AddAddressRequestBody) => {
  return [
    ...getAddressParamArray(requestBody),
    {
      name: 'Title',
      type: sql.NVarChar,
      value: requestBody.title,
    },
    {
      name: 'IsDefault',
      type: sql.Bit,
      value: requestBody.is_default ? 1 : 0,
    },
  ];
};

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<IAccountAddressPojo[]>>
>({
  attachParams: true,
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
})
  .get(async (req, res) => {
    const accountId = req.query.accountId as string;
    const queryResult = await executeUsp<IAccountAddressPojo>(
      'usp_FetchAccountAddressesById',
      [
        {
          name: 'AccountId',
          type: sql.UniqueIdentifier,
          value: accountId,
        },
      ],
    );

    const accountAddresses = queryResult.data;

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: accountAddresses,
    });
  })
  .post(async (req, res) => {
    const requestBody = req.body as AddAddressRequestBody;
    const accountId = req.query.accountId as string;

    const updatedAddresses = (
      await executeUsp<IAccountAddressPojo>('usp_CreateAccountAddress', [
        {
          name: 'AccountId',
          type: sql.UniqueIdentifier,
          value: accountId,
        },
        ...convertRequestBodyToParamArray(requestBody),
      ])
    ).data;

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: updatedAddresses,
    });
  })
  .put(async (req, res) => {
    const requestBody = req.body as UpdateAddressRequestBody;
    const accountId = req.query.accountId as string;
    const addressId = requestBody.id;
    const updatedAddresses = (
      await executeUsp<IAccountAddressPojo>('usp_UpdateAccountAddress', [
        {
          name: 'AccountId',
          type: sql.UniqueIdentifier,
          value: accountId,
        },
        {
          name: 'Id',
          type: sql.UniqueIdentifier,
          value: addressId,
        },
        ...convertRequestBodyToParamArray(requestBody),
      ])
    ).data;

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: updatedAddresses,
    });
  })
  .delete(async (req, res) => {
    const accountId = req.query.accountId as string;
    const addressId = req.query.addressId as string;

    const updatedAddresses = (
      await executeUsp<IAccountAddressPojo>('usp_DeleteAccountAddress', [
        {
          name: 'AccountId',
          type: sql.UniqueIdentifier,
          value: accountId,
        },
        {
          name: 'Id',
          type: sql.UniqueIdentifier,
          value: addressId,
        },
      ])
    ).data;

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: updatedAddresses,
    });
  });

export default handler;
