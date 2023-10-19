import axios from 'axios';

import { assertNever } from './assertion.helper';

import type { CheckoutFormValues } from 'backend/dtos/checkout.dto';
import type {
  AddressType,
  ProvinceApiElement,
} from 'backend/helpers/address.helper';
import type { CustomerAddressModel } from 'models/customerAddress.model';

export interface IAddress {
  streetAddress: string;
  provinceCode: number;
  districtCode: number;
  wardCode: number;

  provinceName: string;
  districtName: string;
  wardName: string;
}

export const transformAddressToFormikValue = (address: IAddress) => {
  const {
    streetAddress,
    provinceName,
    districtName,
    wardName,
    provinceCode,
    districtCode,
    wardCode,
  } = address;

  return {
    province: { name: provinceName, code: provinceCode },
    district: { name: districtName, code: districtCode },
    ward: { name: wardName, code: wardCode },
    streetAddress,
  };
};

export const transformAccountAddressToFormikValue = (
  address: CustomerAddressModel,
) => {
  const { title, ...otherInfo } = address;
  return {
    title,
    isDefault: address.isDefault,
    ...transformAddressToFormikValue(otherInfo),
  };
};

export const transformFormikValueToIAddress = (
  values: CheckoutFormValues,
): IAddress | null => {
  const { province, district, ward, streetAddress } = values;
  if (!province || !district || !ward) return null;
  return {
    streetAddress,
    provinceCode: province.code,
    districtCode: district.code,
    wardCode: ward.code,
    districtName: district.name,
    provinceName: province.name,
    wardName: ward.name,
  };
};
export const getAddressName = async <U extends AddressType>(
  addressType: U,
  code: number,
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
  provinceCode: number;
  districtCode: number;
  wardCode: number;
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

export const getFullAddress2 = (address: Partial<IAddress> | null): string => {
  if (!address) return '';
  const { provinceName, districtName, wardName, streetAddress } = address;
  if (!provinceName || !districtName || !wardName || !streetAddress) return '';
  return `${streetAddress}, ${wardName}, ${districtName}, ${provinceName}, Việt Nam`;
};
