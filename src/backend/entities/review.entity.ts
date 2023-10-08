import type { Relation } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CustomerOrderItemEntity } from './customerOrderItem.entity';

@Entity({ name: 'review' })
export class ReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => CustomerOrderItemEntity)
  customerOrderItem: Relation<CustomerOrderItemEntity>;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: 'text',
    nullable: true,
  })
  comment: string;

  @Column('decimal')
  star: number;
}
