import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EmployeeEntity } from './employee.entity';
import { ReviewEntity } from './review.entity';

@Entity({ name: 'review_response' })
export class ReviewResponseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => ReviewEntity)
  review: Relation<ReviewEntity>;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.reviewResponses)
  employee: Relation<EmployeeEntity>;

  @Column('text')
  comment: string;
}
