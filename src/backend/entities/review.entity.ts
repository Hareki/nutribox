import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { CustomerOrderItemEntity } from './customerOrderItem.entity';
import { ReviewResponseEntity } from './reviewResponse.entity';

@Entity({ name: 'review' })
export class ReviewEntity extends AbstractEntity {
  @OneToOne(() => CustomerOrderItemEntity)
  @JoinColumn()
  customerOrderItem: Relation<CustomerOrderItemEntity> | string;

  @OneToOne(() => ReviewResponseEntity)
  @JoinColumn()
  reviewResponse: Relation<ReviewResponseEntity> | string;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({
    type: 'text',
    nullable: true,
  })
  comment?: string;

  @Column('decimal')
  star: number;
}
