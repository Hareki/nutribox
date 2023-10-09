import { z } from 'zod';

import { zodNumber, zodUuid } from './helper';

const CartItemSchema = z.object({
  product: zodUuid('CartItem.ProductId'),

  customer: zodUuid('CartItem.CustomerId'),

  quantity: zodNumber('CartItem.Quantity', 'int', 1, 100),
});

type CartItemModel = z.infer<typeof CartItemSchema>;

export { CartItemSchema };
export type { CartItemModel };
