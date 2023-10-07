import type { Relation } from 'typeorm';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CustomerOrderItemEntity } from './customerOrderItem.entity';

@Entity({ name: 'review' })
export class ReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => CustomerOrderItemEntity)
  customerOrderItem: Relation<CustomerOrderItemEntity>;

  @Column('date')
  createdAt: Date;

  @Column('text')
  comment: string;

  @Column('decimal')
  star: number;
}
