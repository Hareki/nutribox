import type { Relation } from 'typeorm';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { StoreEntity } from './store.entity';

import { DayOfWeek } from 'backend/enums/Entities.enum';

@Entity({ name: 'store_work_time' })
export class StoreWorkTimeEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => StoreEntity, (store) => store.storeWorkTimes)
  store: Relation<StoreEntity>;

  @Column({
    type: 'enum',
    enum: DayOfWeek,
  })
  dayOfWeek: DayOfWeek;

  @Column('timestamp without time zone')
  openTime: Date;

  @Column('timestamp without time zone')
  closeTime: Date;
}
