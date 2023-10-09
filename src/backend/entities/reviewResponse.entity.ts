import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'updated_at',
  })
  updatedAt: Date;

  @OneToOne(() => ReviewEntity)
  review: Relation<ReviewEntity>;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.reviewResponses)
  employee: Relation<EmployeeEntity>;

  @Column('text')
  comment: string;
}
