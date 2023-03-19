import type { IAccountAddress } from 'api/models/Account.model/AccountAddress.schema/types';
import type { IAddress } from 'api/types/schema.type';

export const getFullAddress = (address: IAddress) => {
  if (!address) return null;
  const { province, district, ward, streetAddress } = address;
  return `${streetAddress}, ${ward}, ${district}, ${province}, Việt Nam`;
};

export const transformAddressToFormikValue = (address: IAccountAddress) => {
  const {
    title,
    streetAddress,
    ward,
    district,
    province,
    wardId,
    districtId,
    provinceId,
  } = address;
  return {
    title,
    province: { name: province, code: provinceId },
    district: { name: district, code: districtId },
    ward: { name: ward, code: wardId },
    streetAddress,
  };
};

export const transformFormikValueToAddress = (values: any) => {
  const { province, district, ward, streetAddress } = values;
  if (!province || !district || !ward) return null;
  return {
    province: province.name,
    district: district.name,
    ward: ward.name,
    streetAddress,
    provinceId: province.code,
    districtId: district.code,
    wardId: ward.code,
  };
};