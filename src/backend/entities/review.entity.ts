import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { CustomerOrderItemEntity } from './customerOrderItem.entity';

@Entity({ name: 'review' })
export class ReviewEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'updated_at',
  })
  updatedAt: Date;

  @OneToOne(() => CustomerOrderItemEntity)
  customerOrderItem: Relation<CustomerOrderItemEntity>;

  @Column({
    type: 'text',
    nullable: true,
  })
  comment: string;

  @Column('decimal')
  star: number;
}
