import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { EmployeeEntity } from './employee.entity';
import { ReviewEntity } from './review.entity';

@Entity({ name: 'review_response' })
export class ReviewResponseEntity extends AbstractEntity {
  @OneToOne(() => ReviewEntity)
  @JoinColumn()
  review: Relation<ReviewEntity>;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.reviewResponses)
  employee: Relation<EmployeeEntity>;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column('text')
  comment: string;
}
