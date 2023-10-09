import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { AccountEntity } from './account.entity';
import { ReviewResponseEntity } from './reviewResponse.entity';

import { EmployeeRole } from 'backend/enums/Entities.enum';

@Entity({ name: 'employee' })
export class EmployeeEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  personalId: string;

  @Column({ type: 'enum', enum: EmployeeRole })
  role: EmployeeRole;

  @OneToOne(() => AccountEntity, (account) => account.employee, {
    nullable: true,
  })
  @JoinColumn()
  account: Relation<AccountEntity>;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column('timestamp without time zone')
  birthday: Date;

  @OneToMany(
    () => ReviewResponseEntity,
    (reviewResponse) => reviewResponse.employee,
  )
  reviewResponses: Relation<ReviewResponseEntity>[];
}
