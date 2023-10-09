import type { Relation } from 'typeorm';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { StoreWorkTimeEntity } from './storeWorkTime.entity';

@Entity({ name: 'store' })
export class StoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  provinceCode: string;

  @Column()
  districtCode: string;

  @Column()
  wardCode: string;

  @Column()
  streetAddress: string;

  @OneToMany(() => StoreWorkTimeEntity, (storeWorkTime) => storeWorkTime.store)
  storeWorkTimes: Relation<StoreWorkTimeEntity>[];
}
