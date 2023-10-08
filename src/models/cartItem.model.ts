import { z } from 'zod';

import { zodNumber, zodUuid } from './helper';

const CartItemSchema = z.object({
  productId: zodUuid('CartItem.ProductId'),
  customerId: zodUuid('CartItem.CustomerId'),
  quantity: zodNumber('CartItem.Quantity', 'int', 1, 100),
});

type CartItemModel = z.infer<typeof CartItemSchema>;

export { CartItemSchema };
export type { CartItemModel };
