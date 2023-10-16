import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import { StoreWorkTimeEntity } from 'backend/entities/storeWorkTime.entity';
import { DayOfWeek } from 'backend/enums/entities.enum';

type StoreWorkTimeSeed = Omit<StoreWorkTimeEntity, 'createdAt' | 'store'> & {
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
      id: 'ce78d779-98f5-5b55-9ee3-926739703cc7',
    },
  },
  {
    id: '55506e3e-0540-56cf-b318-9c912a70ee44',
    openTime: new Date('1970-01-01 08:00:00'),
    closeTime: new Date('1970-01-01 17:00:00'),
    dayOfWeek: DayOfWeek.TUESDAY,
    store: {
      id: 'ce78d779-98f5-5b55-9ee3-926739703cc7',
    },
  },
  {
    id: '4d3bc512-5c47-5970-a593-64a34140c04f',
    openTime: new Date('1970-01-01 08:00:00'),
    closeTime: new Date('1970-01-01 17:00:00'),
    dayOfWeek: DayOfWeek.WEDNESDAY,
    store: {
      id: 'ce78d779-98f5-5b55-9ee3-926739703cc7',
    },
  },
  {
    id: 'b604f820-3caa-5019-b1ef-45ec765f691f',
    openTime: new Date('1970-01-01 08:00:00'),
    closeTime: new Date('1970-01-01 17:00:00'),
    dayOfWeek: DayOfWeek.THURSDAY,
    store: {
      id: 'ce78d779-98f5-5b55-9ee3-926739703cc7',
    },
  },
  {
    id: '24c7407c-148b-51e6-b714-9da7fd3b2d82',
    openTime: new Date('1970-01-01 08:00:00'),
    closeTime: new Date('1970-01-01 17:00:00'),
    dayOfWeek: DayOfWeek.FRIDAY,
    store: {
      id: 'ce78d779-98f5-5b55-9ee3-926739703cc7',
    },
  },
  {
    id: '885e305c-7b1e-5662-bc49-f394ae0ca5c7',
    openTime: new Date('1970-01-01 08:00:00'),
    closeTime: new Date('1970-01-01 17:00:00'),
    dayOfWeek: DayOfWeek.SATURDAY,
    store: {
      id: 'ce78d779-98f5-5b55-9ee3-926739703cc7',
    },
  },
  {
    id: 'b0f420e9-dfb7-5c58-829d-466d18ce08a5',
    openTime: new Date('1970-01-01 08:00:00'),
    closeTime: new Date('1970-01-01 17:00:00'),
    dayOfWeek: DayOfWeek.SUNDAY,
    store: {
      id: 'ce78d779-98f5-5b55-9ee3-926739703cc7',
    },
  },
];

export default class createStoreWorkTimes implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const customerOrderItemRepo = connection.getRepository(StoreWorkTimeEntity);
    await customerOrderItemRepo.save(storeWorkTimeSeeds);
  }
}
