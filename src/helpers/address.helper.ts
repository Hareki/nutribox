import type { IAccountAddress } from 'api/models/Account.model/AccountAddress.schema/types';

export const getFullAddress = (address: IAccountAddress) => {
  const { province, district, ward, streetAddress } = address;
  return `${streetAddress}, ${ward}, ${district}, ${province}`;
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
