import type { Relation } from 'typeorm';
import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { StoreEntity } from './store.entity';

import { DayOfWeek } from 'backend/enums/entities.enum';

@Entity({ name: 'store_work_time' })
export class StoreWorkTimeEntity extends AbstractEntity {
  @ManyToOne(() => StoreEntity, (store) => store.storeWorkTimes)
  store: Relation<StoreEntity> | string;

  @Column({
    type: 'enum',
    enum: DayOfWeek,
  })
  dayOfWeek: DayOfWeek;

  @Column('timestamp with time zone')
  openTime: Date;

  @Column('timestamp with time zone')
  closeTime: Date;
}
