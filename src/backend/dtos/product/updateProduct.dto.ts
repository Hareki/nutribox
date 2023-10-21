import type { z } from 'zod';

import { NewProductDtoSchema } from './newProduct.dto';

export const UpdateProductDtoSchema = NewProductDtoSchema;

export type UpdateProductDto = z.infer<typeof UpdateProductDtoSchema>;
