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

  @Column()
  provinceCode: string;

  @Column()
  districtCode: string;

  @Column()
  wardCode: string;

  @Column()
  streetAddress: string;
}
