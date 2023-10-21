import { z } from 'zod';

import { zodString } from 'models/helper';

export const NewProductImagesDtoSchema = z.object({
  productImages: z.array(zodString('Product.ProductImages')),
});

export type NewProductImagesDto = z.infer<typeof NewProductImagesDtoSchema>;
