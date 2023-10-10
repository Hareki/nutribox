import type { Relation } from 'typeorm';
import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'product_image' })
export class ProductImageEntity extends AbstractEntity {
  @ManyToOne(() => ProductEntity, (product) => product.productImages)
  product: Relation<ProductEntity> | string;

  @Column()
  imageUrl: string;
}
