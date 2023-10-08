import type { Relation } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ExportOrderEntity } from './exportOrder.entity';
import { ProductEntity } from './product.entity';
import { SupplierEntity } from './supplier.entity';

@Entity({ name: 'import_order' })
export class ImportOrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductEntity, (product) => product.importOrders)
  product: Relation<ProductEntity>;

  @ManyToOne(() => SupplierEntity, (supplier) => supplier.importOrders)
  supplier: Relation<SupplierEntity>;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'created_at',
  })
  createdAt: Date;

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

  @OneToMany(() => ExportOrderEntity, (exportOrder) => exportOrder.importOrder)
  exportOrders: Relation<ExportOrderEntity>[];
}
