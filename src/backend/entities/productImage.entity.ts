import type { Relation } from 'typeorm';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'product_image' })
export class ProductImageEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductEntity, (product) => product.productImages)
  product: Relation<ProductEntity>;

  @Column()
  imageUrl: string;
}
