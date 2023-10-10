import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column('timestamp without time zone')
  importDate: Date;

  @Column('timestamp without time zone')
  manufacturingDate: Date;

  @Column('timestamp without time zone')
  expirationDate: Date;

  @Column('int')
  importQuantity: number;

  @Column('decimal')
  unitImportPrice: number;

  @Column('int')
  remainingQuantity: number;
}
