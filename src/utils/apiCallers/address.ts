import type {
  AddAddressRequestBody,
  DeleteAddressQueryParams,
  UpdateAddressRequestBody,
} from '../../../pages/api/address/[accountId]';

import type { IAccountAddress } from 'api/models/Account.model/AccountAddress.schema/types';
import axiosInstance from 'utils/axiosInstance';

export const getAddresses = async (
  accountId: string,
): Promise<IAccountAddress[]> => {
  const response = await axiosInstance.get(`/address/${accountId}`);
  return response.data.data;
};

export const addAddress = async (
  accountId: string,
  addBody: AddAddressRequestBody,
): Promise<IAccountAddress[]> => {
  const response = await axiosInstance.post(`/address/${accountId}`, addBody);
  return response.data.data;
};

export const updateAddress = async (
  accountId: string,
  updateBody: UpdateAddressRequestBody,
): Promise<IAccountAddress[]> => {
  const response = await axiosInstance.put(`/address/${accountId}`, updateBody);
  return response.data.data;
};

export const deleteAddress = async (
  accountId: string,
  { addressId }: DeleteAddressQueryParams,
): Promise<IAccountAddress[]> => {
  const response = await axiosInstance.delete(`/address/${accountId}`, {
    params: { addressId },
  });
  return response.data.data;
};

const apiCaller = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};

export default apiCaller;
