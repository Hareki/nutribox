import type { Relation } from 'typeorm';
import { Column, Entity, OneToMany } from 'typeorm';

import { AddressAbstractEntity } from './addressAbstract.entity';
import { ImportOrderEntity } from './importOrder.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'supplier' })
export class SupplierEntity extends AddressAbstractEntity {
  @OneToMany(() => ImportOrderEntity, (importOrder) => importOrder.supplier)
  importOrders: Relation<ImportOrderEntity>[] | string[];

  @OneToMany(() => ProductEntity, (product) => product.defaultSupplier)
  products: Relation<ProductEntity>[] | string[];

  @Column({
    unique: true,
  })
  name: string;

  @Column()
  phone: string;

  @Column()
  email: string;
}
