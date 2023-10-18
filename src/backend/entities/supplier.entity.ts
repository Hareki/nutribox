import type { Relation } from 'typeorm';
import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { ImportOrderEntity } from './importOrder.entity';

@Entity({ name: 'supplier' })
export class SupplierEntity extends AbstractEntity {
  @OneToMany(() => ImportOrderEntity, (importOrder) => importOrder.supplier)
  importOrders: Relation<ImportOrderEntity>[] | string[];

  @Column({
    unique: true,
  })
  name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column('int')
  provinceCode: number;

  @Column('int')
  districtCode: number;

  @Column('int')
  wardCode: number;

  @Column('text')
  provinceName: string;

  @Column('text')
  districtName: string;

  @Column('text')
  wardName: string;

  @Column()
  streetAddress: string;
}
