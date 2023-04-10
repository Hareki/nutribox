import type { Types } from 'mongoose';

import type { IAccountAddress } from './AccountAddress.schema/types';
import type { ICartItem, IPopulatedCartItem } from './CartItem.schema/types';

export interface IAccount {
  // _id: Types.ObjectId;
  id: string;
  role: 'ADMIN' | 'CUSTOMER' | 'SUPPLIER';
  // Embedded documents can be accessed directly this way
  cartItems: Types.DocumentArray<ICartItem>; // ICartItem
  addresses: Types.DocumentArray<IAccountAddress>; // IAccountAddress

  // Populated documents need to be accessed this way
  customerOrders: Types.ObjectId[]; // ICustomerOrder
  passwordReset: Types.ObjectId; // IPasswordReset

  firstName: string;
  lastName: string;
  birthday: string;
  avatarUrl: string;
  email: string;
  phone: string;
  password: string;
  verified: boolean;

  verificationToken: string;
  verificationTokenExpires: Date;

  fullName: string;
  isPasswordMatch: (
    candidatePassword: string,
    userPassword: string,
  ) => Promise<boolean>;
}

export interface IAccountWithTotalOrders extends IAccount {
  totalOrders: number;
}
export interface IPopulatedCartItemsAccount
  extends Omit<IAccount, 'cartItems'> {
  cartItems: IPopulatedCartItem[];
}

export interface IAccountInput
  extends Omit<
    IAccount,
    | '_id'
    | 'cartItems'
    | 'addresses'
    | 'customerOrders'
    | 'passwordReset'
    | 'verified'
  > {
  cartItems?: Types.DocumentArray<ICartItem>; // ICartItem
  addresses?: Types.DocumentArray<IAccountAddress>; // IAccountAddress
  customerOrders?: Types.ObjectId[]; // ICustomerOrder
  passwordReset?: Types.ObjectId; // IPasswordReset
  verified?: boolean;
}
