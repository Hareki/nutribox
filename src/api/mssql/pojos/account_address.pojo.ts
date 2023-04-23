import type { PoIAddress } from './abstract/address.pojo';

export interface PoIAccountAddress extends PoIAddress {
  id: string;
  account_id: string;
  title: string;
  is_default?: boolean;
}

export interface IAccountAddressInput
  extends Omit<PoIAccountAddress, '_id' | 'account_id'> {}
