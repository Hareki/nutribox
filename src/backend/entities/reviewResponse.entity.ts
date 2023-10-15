import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { EmployeeEntity } from './employee.entity';
import { ReviewEntity } from './review.entity';

@Entity({ name: 'review_response' })
export class ReviewResponseEntity extends AbstractEntity {
  @OneToOne(() => ReviewEntity)
  @JoinColumn()
  review: Relation<ReviewEntity> | string;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.reviewResponses)
  employee: Relation<EmployeeEntity> | string;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column('text')
  comment: string;
}
