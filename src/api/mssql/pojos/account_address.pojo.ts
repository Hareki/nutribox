import type { IAddress } from 'api/types/schema.type';

export interface IAccountAddress extends IAddress {
  id: string;
  account_id: string;
  title: string;
  is_default?: boolean;
}

export interface IAccountAddressInput
  extends Omit<IAccountAddress, '_id' | 'account_id'> {}
