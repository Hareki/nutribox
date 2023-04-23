import type { PoIAddress } from './abstract/address.pojo';

export interface PoISupplier extends PoIAddress {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface PoISupplierDropdown extends Pick<PoISupplier, 'id' | 'name'> {}

export interface PoISupplierInput extends Omit<PoISupplier, 'id'> {}
