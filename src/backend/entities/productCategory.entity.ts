import type { Relation } from 'typeorm';
import { Column, Entity, OneToMany, Unique } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'product_category' })
@Unique('UQ_PRODUCT_CATEGORY_NAME', ['name'])
export class ProductCategoryEntity extends AbstractEntity {
  @OneToMany(() => ProductEntity, (product) => product.productCategory)
  products: Relation<ProductEntity>[] | string[];

  @Column({
    default: true,
  })
  available: boolean;

  @Column()
  name: string;
}
