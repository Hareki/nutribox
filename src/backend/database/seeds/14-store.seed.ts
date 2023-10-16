import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import { StoreEntity } from 'backend/entities/store.entity';

type StoreSeed = Omit<StoreEntity, 'createdAt' | 'storeWorkTimes'>;

const storeSeeds: StoreSeed[] = [
  {
    id: 'ce78d779-98f5-5b55-9ee3-926739703cc7',
    email: 'store@gmail.com',
    phone: '0338758008',
    provinceCode: '79',
    districtCode: '769',
    wardCode: '26812',
    streetAddress: '12/12 Đường 49',
  },
];

export default class createStores implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const customerOrderItemRepo = connection.getRepository(StoreEntity);
    await customerOrderItemRepo.save(storeSeeds);
  }
}
