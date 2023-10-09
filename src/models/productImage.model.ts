import { z } from 'zod';

import { zodString, zodUuid } from './helper';

const ProductImageSchema = z.object({
  id: zodUuid('ProductImage.Id'),

  product: zodUuid('ProductImage.ProductId'),

  imageUrl: zodString('ProductImage.ImageUrl', 1, 500),
});

type ProductImageModel = z.infer<typeof ProductImageSchema>;

export { ProductImageSchema };
export type { ProductImageModel };
