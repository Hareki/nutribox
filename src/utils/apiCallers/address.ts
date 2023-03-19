import axios from 'axios';

import type {
  AddAddressRequestBody,
  DeleteAddressQueryParams,
  UpdateAddressRequestBody,
} from '../../../pages/api/profile/address/[accountId]';

import type { IAccountAddress } from 'api/models/Account.model/AccountAddress.schema/types';
import appAxios from 'utils/axiosInstance';

export interface AddressAPI {
  code: number;
  name: string;
}

const AddressAPIBaseURL = 'https://provinces.open-api.vn/api';

export const getAddresses = async (
  accountId: string,
): Promise<IAccountAddress[]> => {
  const response = await appAxios.get(`/profile/address/${accountId}`);
  return response.data.data;
};

export const addAddress = async (
  accountId: string,
  addBody: AddAddressRequestBody,
): Promise<IAccountAddress[]> => {
  const response = await appAxios.post(
    `/profile/address/${accountId}`,
    addBody,
  );
  return response.data.data;
};

export const updateAddress = async (
  accountId: string,
  updateBody: UpdateAddressRequestBody,
): Promise<IAccountAddress[]> => {
  const response = await appAxios.put(
    `/profile/address/${accountId}`,
    updateBody,
  );
  return response.data.data;
};

export const setDefaultAddress = async (
  accountId: string,
  addressId: string,
): Promise<IAccountAddress[]> => {
  const response = await appAxios.put(`/profile/address/default/${accountId}`, {
    id: addressId,
  });
  return response.data.data;
};

export const deleteAddress = async (
  accountId: string,
  { addressId }: DeleteAddressQueryParams,
): Promise<IAccountAddress[]> => {
  const response = await appAxios.delete(`/profile/address/${accountId}`, {
    params: { addressId },
  });
  return response.data.data;
};

export const getProvinces = async (): Promise<AddressAPI[]> => {
  const response = await axios.get(`${AddressAPIBaseURL}/p`);
  return response.data;
};

export const getDistricts = async (
  provinceId: number,
): Promise<AddressAPI[]> => {
  const response = await axios.get(`${AddressAPIBaseURL}/p/${provinceId}`, {
    params: {
      depth: 2,
    },
  });
  return response.data.districts;
};

export const getWards = async (districtId: number): Promise<AddressAPI[]> => {
  const response = await axios.get(`${AddressAPIBaseURL}/d/${districtId}`, {
    params: {
      depth: 2,
    },
  });
  return response.data.wards;
};

const apiCaller = {
  getAddresses,
  addAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
  getProvinces,
  getDistricts,
  getWards,
};

export default apiCaller;
