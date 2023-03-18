import type { IAccountAddress } from 'api/models/Account.model/AccountAddress.schema/types';

export const getFullAddress = (address: IAccountAddress) => {
  const { province, district, ward, streetAddress } = address;
  return `${streetAddress}, ${ward}, ${district}, ${province}`;
};
