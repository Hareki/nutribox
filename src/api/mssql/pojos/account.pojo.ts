import type { IAccountAddress } from './account_address.pojo';
import type { ICartItem, IPopulatedCartItem } from './cart_item.pojo';

export interface IAccount {
  id: string;
  //   role: 'ADMIN' | 'CUSTOMER' | 'SUPPLIER';

  // Embedded documents can be accessed directly this way
  //   cart_items: string[]; // ICartItem
  //   addresses: string[]; // IAccountAddress

  // Populated documents need to be accessed this way
  //   customer_orders: string[]; // ICustomerOrder

  first_name: string;
  last_name: string;
  birthday: string;
  avatar_url: string;
  email: string;
  phone: string;
  password: string;
  verified: boolean;
}

export interface IAccountWithTotalOrders extends IAccount {
  totalOrders: number;
}
export interface IPopulatedCartItemsAccount
  extends Omit<IAccount, 'cart_items'> {
  cart_items: IPopulatedCartItem[];
}

export interface IAccountInput
  extends Omit<
    IAccount,
    '_id' | 'cart_items' | 'addresses' | 'customer_orders' | 'verified'
  > {
  cart_items?: ICartItem[]; // ICartItem
  addresses?: IAccountAddress[]; // IAccountAddress
  customer_orders?: string[]; // ICustomerOrder
  verified?: boolean;
}
