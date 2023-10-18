import axios from 'axios';

import { assertNever } from './assertion.helper';

import type {
  AddressType,
  ProvinceApiElement,
} from 'backend/helpers/address.helper';
import type { CustomerAddressModel } from 'models/customerAddress.model';

export interface IAddress {
  streetAddress: string;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
}

export const transformAddressToFormikValue = async (address: IAddress) => {
  const { streetAddress, provinceCode, districtCode, wardCode } = address;
  const [province, district, ward] = await Promise.all([
    getAddressName('province', provinceCode),
    getAddressName('district', districtCode),
    getAddressName('ward', wardCode),
  ]);

  return {
    province: { name: province, code: provinceCode },
    district: { name: district, code: districtCode },
    ward: { name: ward, code: wardCode },
    streetAddress,
  };
};

export const transformAccountAddressToFormikValue = (
  address: CustomerAddressModel,
) => {
  const { type, ...otherInfo } = address;
  return {
    type,
    ...transformAddressToFormikValue(otherInfo),
  };
};

export const transformFormikValueToAddress = (
  values: any,
): GetFullAddressInputs => {
  const { province, district, ward, streetAddress } = values;
  return {
    streetAddress,
    provinceCode: province.code,
    districtCode: district.code,
    wardCode: ward.code,
  };
};
export const getAddressName = async <U extends AddressType>(
  addressType: U,
  code: string,
) => {
  let prefix: 'p' | 'd' | 'w' = 'p';
  switch (addressType) {
    case 'province':
      prefix = 'p';
      break;
    case 'district':
      prefix = 'd';
      break;
    case 'ward':
      prefix = 'w';
      break;
    default: {
      assertNever(addressType);
    }
  }

  const url = `${process.env.NEXT_PUBLIC_PROVINCE_API_URL}/${prefix}/${code}`;

  const { data } = await axios.get<ProvinceApiElement<U>>(url);
  return data.name;
};

export type GetFullAddressInputs = {
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  streetAddress: string;
};

export const getFullAddress = async ({
  provinceCode,
  districtCode,
  wardCode,
  streetAddress,
}: GetFullAddressInputs) => {
  const provinceName = await getAddressName('province', provinceCode);
  const districtName = await getAddressName('district', districtCode);
  const wardName = await getAddressName('ward', wardCode);
  return `${streetAddress}, ${wardName}, ${districtName}, ${provinceName}, Việt Nam`;
};
