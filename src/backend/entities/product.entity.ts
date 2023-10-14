import type { Relation } from 'typeorm';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { CartItemEntity } from './cartItem.entity';
import { CustomerOrderItemEntity } from './customerOrderItem.entity';
import { ImportOrderEntity } from './importOrder.entity';
import { ProductCategoryEntity } from './productCategory.entity';
import { ProductImageEntity } from './productImage.entity';

@Entity({ name: 'product' })
export class ProductEntity extends AbstractEntity {
  @ManyToOne(
    () => ProductCategoryEntity,
    (productCategory) => productCategory.products,
  )
  productCategory: Relation<ProductCategoryEntity> | string;

  @OneToMany(() => ProductImageEntity, (productImage) => productImage.product)
  productImages: Relation<ProductImageEntity>[] | string[];

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.product)
  cartItems: Relation<CartItemEntity>[] | string[];

  @OneToMany(
    () => CustomerOrderItemEntity,
    (customerOrderItem) => customerOrderItem.product,
  )
  customerOrderItems: Relation<CustomerOrderItemEntity>[] | string[];

  @OneToMany(() => ImportOrderEntity, (importOrder) => importOrder.product)
  importOrders: Relation<ImportOrderEntity>[] | string[];

  @Column({
    unique: true,
  })
  name: string;

  @Column('decimal')
  defaultImportPrice: number;

  @Column('decimal')
  retailPrice: number;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  defaultSupplierId?: string;

  @Column()
  description: string;

  @Column('int')
  shelfLife: number;

  @Column({
    default: true,
  })
  available: boolean;

  @Column('int')
  maxQuantity: number;
}
