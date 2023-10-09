import type { Relation } from 'typeorm';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'product_category' })
export class ProductCategoryEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  available: boolean;

  @Column({
    unique: true,
  })
  name: string;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: Relation<ProductEntity>[];
}
