import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { CustomerEntity } from './customer.entity';
import { EmployeeEntity } from './employee.entity';

@Entity({ name: 'account' })
export class AccountEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({
    default: false,
  })
  disabled: boolean;

  @Column({
    default: false,
  })
  verified: boolean;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ nullable: true, type: 'timestamp without time zone' })
  verificationTokenExpiry: Date;

  @Column({ nullable: true })
  forgotPasswordToken: string;

  @Column({ nullable: true, type: 'timestamp without time zone' })
  forgotPasswordTokenExpiry: Date;

  @OneToOne(() => CustomerEntity, (customer) => customer.account, {
    nullable: true,
  })
  @JoinColumn()
  customer: Relation<CustomerEntity>;

  @OneToOne(() => EmployeeEntity, (employee) => employee.account, {
    nullable: true,
  })
  @JoinColumn()
  employee: Relation<EmployeeEntity>;
}
