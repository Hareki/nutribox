import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import { CartItemEntity } from 'backend/entities/cartItem.entity';
import type { CartItemModel } from 'models/cartItem.model';

type CartItemSeed = Omit<
  CartItemModel,
  'createdAt' | 'customer' | 'product'
> & {
  customer: {
    id: string;
  };
  product: {
    id: string;
  };
};

const cartItemSeeds: CartItemSeed[] = [
  {
    id: '709beff6-56f2-42f9-aa0d-06a2cfe9b9a3',
    product: {
      id: 'd1b3ce4d-6a49-5991-b330-8eaf371c6efd',
    },
    quantity: 12,
    customer: {
      id: 'e31e759a-edb9-40e8-bb2a-fb6b9e65d986',
    },
  },
];

export default class createCartItems implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const cartItemRepo = connection.getRepository(CartItemEntity);
    const res = cartItemRepo.create(cartItemSeeds);
    await cartItemRepo.save(res);
  }
}
