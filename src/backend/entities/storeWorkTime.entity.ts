import type { Relation } from 'typeorm';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Store } from './store.entity';

import { DayOfWeek } from 'backend/enums/Entities.enum';

@Entity({ name: 'store_work_time' })
export class StoreWorkTime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Store, (store) => store.workTimes)
  store: Relation<Store>;

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
