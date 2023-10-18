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

  @Column('int')
  provinceCode: number;

  @Column('int')
  districtCode: number;

  @Column('int')
  wardCode: number;

  @Column('text')
  provinceName: string;

  @Column('text')
  districtName: string;

  @Column('text')
  wardName: string;

  @Column()
  streetAddress: string;
}
