import type { Relation } from 'typeorm';
import { Column, Entity, OneToMany } from 'typeorm';

import { AddressAbstractEntity } from './addressAbstract.entity';
import { ImportOrderEntity } from './importOrder.entity';

@Entity({ name: 'supplier' })
export class SupplierEntity extends AddressAbstractEntity {
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
}
