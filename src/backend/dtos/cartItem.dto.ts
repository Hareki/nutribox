import type { z } from 'zod';

import { CartItemSchema } from 'models/cartItem.model';

export const CartItemDtoSchema = CartItemSchema.pick({
  product: true,
  quantity: true,
}).required();

export type CartItemDto = z.infer<typeof CartItemDtoSchema>;
