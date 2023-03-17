import type { Types } from 'mongoose';

import type { IAddress } from 'api/types/schema.type';

export interface IAccountAddress extends IAddress {
  _id: Types.ObjectId;
  id?: string;
  // Note: No need, because it's already embedded in the account
  // account: IAccount;
}

export interface IAccountAddressInput extends Omit<IAccountAddress, '_id'> {}
