import type { IAddress } from './abstract/address.pojo';

export interface ISupplier extends IAddress {
  id: string;
  //   product_orders: string[];

  name: string;
  phone: string;
  email: string;
}

export interface ISupplierDropdown extends Pick<ISupplier, 'id' | 'name'> {}

export interface ISupplierInput
  extends Omit<ISupplier, 'product_orders' | 'id'> {}
