import type { Relation } from 'typeorm';
import { Column, Entity, OneToOne, JoinColumn, OneToMany } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { AccountEntity } from './account.entity';
import { ReviewResponseEntity } from './reviewResponse.entity';

import { EmployeeRole } from 'backend/enums/entities.enum';

@Entity({ name: 'employee' })
export class EmployeeEntity extends AbstractEntity {
  @OneToMany(
    () => ReviewResponseEntity,
    (reviewResponse) => reviewResponse.employee,
  )
  reviewResponses: Relation<ReviewResponseEntity>[] | string[];

  @Column()
  personalId: string;

  @Column({ type: 'enum', enum: EmployeeRole })
  role: EmployeeRole;

  @OneToOne(() => AccountEntity, (account) => account.employee, {
    nullable: true,
  })
  @JoinColumn()
  account?: Relation<AccountEntity> | string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column('timestamp with time zone')
  birthday: Date;
}
