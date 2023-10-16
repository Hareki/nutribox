import type { Relation } from 'typeorm';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { ExportOrderEntity } from './exportOrder.entity';
import { ProductEntity } from './product.entity';
import { SupplierEntity } from './supplier.entity';

@Entity({ name: 'import_order' })
export class ImportOrderEntity extends AbstractEntity {
  @ManyToOne(() => ProductEntity, (product) => product.importOrders)
  product: Relation<ProductEntity> | string;

  @ManyToOne(() => SupplierEntity, (supplier) => supplier.importOrders)
  supplier: Relation<SupplierEntity> | string;

  @OneToMany(() => ExportOrderEntity, (exportOrder) => exportOrder.importOrder)
  exportOrders: Relation<ExportOrderEntity>[] | string[];

  @Column('timestamp with time zone')
  importDate: Date;

  @Column('timestamp with time zone')
  manufacturingDate: Date;

  @Column({
    type: 'timestamp with time zone',
    name: 'expiration_date',
  })
  expirationDate: Date;

  @Column('int')
  importQuantity: number;

  @Column('decimal')
  unitImportPrice: number;

  @Column('int')
  remainingQuantity: number;
}
