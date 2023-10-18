import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import { StoreWorkTimeEntity } from 'backend/entities/storeWorkTime.entity';
import { DayOfWeek } from 'backend/enums/entities.enum';
import { STORE_ID } from 'constants/temp.constant';
import type { StoreWorkTimeModel } from 'models/storeWorkTime.model';

type StoreWorkTimeSeed = Omit<StoreWorkTimeModel, 'createdAt' | 'store'> & {
  store: {
    id: string;
  };
};

const storeWorkTimeSeeds: StoreWorkTimeSeed[] = [
  {
    id: '88aa491b-9f58-55db-a68b-272ac3af5bfa',
    openTime: new Date('1970-01-01 08:00:00'),
    closeTime: new Date('1970-01-01 17:00:00'),
    dayOfWeek: DayOfWeek.MONDAY,
    store: {
      id: STORE_ID,
    },
  },
  {
    id: '55506e3e-0540-56cf-b318-9c912a70ee44',
    openTime: new Date('1970-01-01 08:00:00'),
    closeTime: new Date('1970-01-01 17:00:00'),
    dayOfWeek: DayOfWeek.TUESDAY,
    store: {
      id: STORE_ID,
    },
  },
  {
    id: '4d3bc512-5c47-5970-a593-64a34140c04f',
    openTime: new Date('1970-01-01 08:00:00'),
    closeTime: new Date('1970-01-01 17:00:00'),
    dayOfWeek: DayOfWeek.WEDNESDAY,
    store: {
      id: STORE_ID,
    },
  },
  {
    id: 'b604f820-3caa-5019-b1ef-45ec765f691f',
    openTime: new Date('1970-01-01 08:00:00'),
    closeTime: new Date('1970-01-01 17:00:00'),
    dayOfWeek: DayOfWeek.THURSDAY,
    store: {
      id: STORE_ID,
    },
  },
  {
    id: '24c7407c-148b-51e6-b714-9da7fd3b2d82',
    openTime: new Date('1970-01-01 08:00:00'),
    closeTime: new Date('1970-01-01 17:00:00'),
    dayOfWeek: DayOfWeek.FRIDAY,
    store: {
      id: STORE_ID,
    },
  },
  {
    id: '885e305c-7b1e-5662-bc49-f394ae0ca5c7',
    openTime: new Date('1970-01-01 08:00:00'),
    closeTime: new Date('1970-01-01 17:00:00'),
    dayOfWeek: DayOfWeek.SATURDAY,
    store: {
      id: STORE_ID,
    },
  },
  {
    id: 'b0f420e9-dfb7-5c58-829d-466d18ce08a5',
    openTime: new Date('1970-01-01 08:00:00'),
    closeTime: new Date('1970-01-01 17:00:00'),
    dayOfWeek: DayOfWeek.SUNDAY,
    store: {
      id: STORE_ID,
    },
  },
];

export default class createStoreWorkTimes implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const customerOrderItemRepo = connection.getRepository(StoreWorkTimeEntity);
    const res = customerOrderItemRepo.create(storeWorkTimeSeeds);
    await customerOrderItemRepo.save(res);
  }
}
