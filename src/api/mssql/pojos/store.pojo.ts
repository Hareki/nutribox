import type { IAddress } from './abstract/address.pojo';
import type { IStoreHourInput } from './store_hour.pojo';

export interface IStore extends IAddress {
  id: string;
  //   store_hours: string[];

  phone: string;
  email: string;
}

export interface IStoreInput extends Omit<IStore, 'id' | 'store_hours'> {
  storeHours: IStoreHourInput[];
}
