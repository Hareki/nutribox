import type { Relation } from 'typeorm';
import { Column, Entity, OneToMany, Unique } from 'typeorm';

import { AddressAbstractEntity } from './addressAbstract.entity';
import { ImportOrderEntity } from './importOrder.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'supplier' })
@Unique('UQ_SUPPLIER_NAME', ['name'])
@Unique('UQ_SUPPLIER_PHONE', ['phone'])
@Unique('UQ_SUPPLIER_EMAIL', ['email'])
export class SupplierEntity extends AddressAbstractEntity {
  @OneToMany(() => ImportOrderEntity, (importOrder) => importOrder.supplier)
  importOrders: Relation<ImportOrderEntity>[] | string[];

  @OneToMany(() => ProductEntity, (product) => product.defaultSupplier)
  products: Relation<ProductEntity>[] | string[];

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  email: string;
}
