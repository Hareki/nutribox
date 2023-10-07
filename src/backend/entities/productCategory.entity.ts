import type { Relation } from 'typeorm';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ProductEntity } from './product.entity';

@Entity({ name: 'product_category' })
export class ProductCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  available: boolean;

  @Column()
  name: string;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: Relation<ProductEntity>[];
}
