import type { Relation } from 'typeorm';
import { Column, Entity, OneToMany, Unique } from 'typeorm';

import { AddressAbstractEntity } from './addressAbstract.entity';
import { StoreWorkTimeEntity } from './storeWorkTime.entity';

@Entity({ name: 'store' })
@Unique('UQ_STORE_EMAIL', ['email'])
@Unique('UQ_STORE_PHONE', ['phone'])
export class StoreEntity extends AddressAbstractEntity {
  @OneToMany(() => StoreWorkTimeEntity, (storeWorkTime) => storeWorkTime.store)
  storeWorkTimes: Relation<StoreWorkTimeEntity>[] | string[];

  @Column()
  email: string;

  @Column()
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
