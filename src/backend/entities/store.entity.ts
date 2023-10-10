import type { Relation } from 'typeorm';
import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { StoreWorkTimeEntity } from './storeWorkTime.entity';

@Entity({ name: 'store' })
export class StoreEntity extends AbstractEntity {
  @OneToMany(() => StoreWorkTimeEntity, (storeWorkTime) => storeWorkTime.store)
  storeWorkTimes: Relation<StoreWorkTimeEntity>[] | string[];

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    unique: true,
  })
  phone: string;

  @Column()
  provinceCode: string;

  @Column()
  districtCode: string;

  @Column()
  wardCode: string;

  @Column()
  streetAddress: string;
}
