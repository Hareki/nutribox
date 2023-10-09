import type { Relation } from 'typeorm';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { StoreWorkTimeEntity } from './storeWorkTime.entity';

@Entity({ name: 'store' })
export class StoreEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @OneToMany(() => StoreWorkTimeEntity, (storeWorkTime) => storeWorkTime.store)
  storeWorkTimes: Relation<StoreWorkTimeEntity>[];
}
