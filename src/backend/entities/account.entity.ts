import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

import { CustomerEntity } from './customer.entity';
import { EmployeeEntity } from './employee.entity';

@Entity({ name: 'account' })
export class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column()
  disabled: boolean;

  @Column()
  verified: boolean;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ nullable: true, type: 'date' })
  verificationTokenExpiry: Date;

  @Column({ nullable: true })
  forgotPasswordToken: string;

  @Column({ nullable: true, type: 'date' })
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
