import type { PoIPopulatedCartItem } from './cart_item.pojo';

export interface PoIAccount {
  id: string;
  first_name: string;
  last_name: string;
  birthday: string;
  avatar_url: string;
  email: string;
  phone: string;
  password: string;
  verified: boolean;
}

export interface PoIAccountWithTotalOrders extends PoIAccount {
  totalOrders: number;
}
export interface PoIPopulatedCartItemsAccount extends PoIAccount {
  cart_items: PoIPopulatedCartItem[];
}
