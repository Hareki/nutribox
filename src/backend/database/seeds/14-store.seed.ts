import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import type { AddressNameKeys } from './03-customerAddress.seed';

import { StoreEntity } from 'backend/entities/store.entity';
import { STORE_ID } from 'constants/temp.constant';
import type { StoreModel } from 'models/store.model';

type StoreSeed = Omit<
  StoreModel,
  'createdAt' | 'storeWorkTimes' | AddressNameKeys
>;

const storeSeeds: StoreSeed[] = [
  {
    id: STORE_ID,
    email: 'store@gmail.com',
    phone: '0338758008',
    provinceCode: 79,
    districtCode: 769,
    wardCode: 26812,
    streetAddress: '12/12 Đường 49',
  },
];

export default class createStores implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const customerOrderItemRepo = connection.getRepository(StoreEntity);
    const res = customerOrderItemRepo.create(storeSeeds);
    await customerOrderItemRepo.save(res);
  }
}
