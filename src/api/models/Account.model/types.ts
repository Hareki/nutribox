import { Types } from 'mongoose';

import { IAccountAddress } from './AccountAddress.schema/types';
import { ICartItem } from './CartItem.schema/types';

export interface IAccount {
  _id: Types.ObjectId;
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
  avatarUrl: string;
  email: string;
  password: string;
  verified: boolean;

  fullName: string;
  isPasswordMatch: (
    candidatePassword: string,
    userPassword: string,
  ) => Promise<boolean>;
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
