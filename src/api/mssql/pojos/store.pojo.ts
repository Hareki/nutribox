import type { PoIAddress } from './abstract/address.pojo';
import type { IStoreHour } from './store_hour.pojo';

export interface PoIStore extends PoIAddress {
  id: string;
  phone: string;
  email: string;
}

export interface PoIStoreWithJsonStoreHours extends PoIStore {
  store_hours: string;
}

export interface PoIStoreWithStoreHours extends PoIStore {
  store_hours: IStoreHour[];
}
