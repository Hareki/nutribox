import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CartItemEntity } from './cartItem.entity';
import { CustomerOrderItemEntity } from './customerOrderItem.entity';
import { ImportOrderEntity } from './importOrder.entity';
import { ProductCategoryEntity } from './productCategory.entity';
import { ProductImageEntity } from './productImage.entity';

@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => ProductCategoryEntity,
    (productCategory) => productCategory.products,
  )
  category: Relation<ProductCategoryEntity>;

  @Column()
  name: string;

  @Column('decimal')
  defaultImportPrice: number;

  @Column('decimal')
  retailPrice: number;

  @Column('uuid')
  defaultSupplierId: string;

  @Column()
  description: string;

  @Column('int')
  shelfLife: number;

  @Column()
  available: boolean;

  @Column('int')
  maxQuantity: number;

  @OneToMany(() => ProductImageEntity, (productImage) => productImage.product)
  images: Relation<ProductImageEntity>[];

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.product)
  cartItems: Relation<CartItemEntity>[];

  @OneToMany(
    () => CustomerOrderItemEntity,
    (customerOrderItem) => customerOrderItem.product,
  )
  customerOrderItems: Relation<CustomerOrderItemEntity>[];

  @OneToMany(() => ImportOrderEntity, (importOrder) => importOrder.product)
  importOrders: Relation<ImportOrderEntity>[];
}
