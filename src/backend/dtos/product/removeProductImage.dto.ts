import { z } from 'zod';

import { zodString } from 'models/helper';

export const RemoveProductImageDtoSchema = z.object({
  productImageUrl: zodString('Product.ProductImages'),
});

export type RemoveProductImageDto = z.infer<typeof RemoveProductImageDtoSchema>;
