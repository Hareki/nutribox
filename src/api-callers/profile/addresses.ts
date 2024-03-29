import axios from 'axios';

import type { NewCustomerAddressDto } from 'backend/dtos/profile/addresses/newCustomerAddress.dto';
import type { SetDefaultCustomerAddressDto } from 'backend/dtos/profile/addresses/setDefaultCustomerAddress.dto';
import type { UpdateCustomerAddressDto } from 'backend/dtos/profile/addresses/updateCustomerAddress.dto';
import type { ProvinceApiElement } from 'backend/helpers/address.helper';
import type { JSSuccess } from 'backend/types/jsend';
import appAxios from 'constants/axiosFe.constant';
import {
  ADDRESSES_API_ROUTE,
  ADDRESS_DETAIL_API_ROUTE,
} from 'constants/routes.api.constant';
import type { CustomerAddressModel } from 'models/customerAddress.model';
import { insertId } from 'utils/middleware.helper';

export const getAddresses = async (): Promise<CustomerAddressModel[]> => {
  const response =
    await appAxios.get<JSSuccess<CustomerAddressModel[]>>(ADDRESSES_API_ROUTE);
  return response.data.data;
};

export const addAddress = async (
  dto: NewCustomerAddressDto,
): Promise<CustomerAddressModel[]> => {
  const response = await appAxios.post<JSSuccess<CustomerAddressModel[]>>(
    ADDRESSES_API_ROUTE,
    dto,
  );
  return response.data.data;
};

export const updateAddress = async (
  id: string,
  dto: UpdateCustomerAddressDto,
): Promise<CustomerAddressModel[]> => {
  const response = await appAxios.put<JSSuccess<CustomerAddressModel[]>>(
    insertId(ADDRESS_DETAIL_API_ROUTE, id),
    dto,
  );
  return response.data.data;
};

export const setDefaultAddress = async (
  id: string,
  dto: SetDefaultCustomerAddressDto,
): Promise<CustomerAddressModel[]> => {
  const response = await appAxios.put<JSSuccess<CustomerAddressModel[]>>(
    insertId(ADDRESS_DETAIL_API_ROUTE, id),
    dto,
  );
  return response.data.data;
};

export const deleteAddress = async (
  id: string,
): Promise<CustomerAddressModel[]> => {
  const response = await appAxios.delete<JSSuccess<CustomerAddressModel[]>>(
    insertId(ADDRESS_DETAIL_API_ROUTE, id),
  );
  return response.data.data;
};

type GetProvincesResponse = ProvinceApiElement<'province'>[];
export const getProvinces = async (): Promise<GetProvincesResponse> => {
  const response = await axios.get<GetProvincesResponse>(
    `${process.env.NEXT_PUBLIC_PROVINCE_API_URL}/p`,
  );
  return response.data;
};

type GetDistrictsResponse = ProvinceApiElement<'district'>[];
export const getDistricts = async (
  provinceId: number,
): Promise<GetDistrictsResponse> => {
  const response = await axios.get<ProvinceApiElement<'province'>>(
    `${process.env.NEXT_PUBLIC_PROVINCE_API_URL}/p/${provinceId}`,
    {
      params: {
        depth: 2,
      },
    },
  );
  return response.data.districts;
};

type GetWardsResponse = ProvinceApiElement<'ward'>[];
export const getWards = async (
  districtId: number,
): Promise<GetWardsResponse> => {
  const response = await axios.get<ProvinceApiElement<'district'>>(
    `${process.env.NEXT_PUBLIC_PROVINCE_API_URL}/d/${districtId}`,
    {
      params: {
        depth: 2,
      },
    },
  );
  return response.data.wards;
};

const addressCaller = {
  getAddresses,
  addAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
  getProvinces,
  getDistricts,
  getWards,
};

export default addressCaller;
