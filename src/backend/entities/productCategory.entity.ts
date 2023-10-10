import type { Relation } from 'typeorm';
import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'product_category' })
export class ProductCategoryEntity extends AbstractEntity {
  @OneToMany(() => ProductEntity, (product) => product.productCategory)
  products: Relation<ProductEntity>[] | string[];

  @Column({
    default: true,
  })
  available: boolean;

  @Column({
    unique: true,
  })
  name: string;
}
