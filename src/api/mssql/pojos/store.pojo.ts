import type { IAddress } from './abstract/address.pojo';
import type { IStoreHour, IStoreHourInput } from './store_hour.pojo';

export interface IStore extends IAddress {
  id: string;
  //   store_hours: string[];

  phone: string;
  email: string;
}

export interface IStoreWithJsonStoreHours extends IStore {
  store_hours: string;
}

export interface IStoreWithStoreHours extends IStore {
  store_hours: IStoreHour[];
}

export interface IStoreInput extends Omit<IStore, 'id' | 'store_hours'> {
  store_hours: IStoreHourInput[];
}
