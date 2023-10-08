import { z } from 'zod';

import {
  zodString,
  type RefinementParameters,
  zodNumber,
  zodUuid,
} from './helper';

const ProductSchema = z.object({
  id: zodUuid('Product.Id'),
  categoryId: zodUuid('Product.CategoryId'),
  name: zodString('Product.Name', 3, 50),

  defaultImportPrice: zodNumber(
    'Product.DefaultImportPrice',
    'float',
    0,
    10_000_000,
  ),
  retailPrice: zodNumber('Product.RetailPrice', 'float', 0, 10_000_000),
  defaultSupplierId: zodUuid('Product.DefaultSupplierId'),
  description: zodString('Product.Description', 1, 500),
  shelfLife: zodNumber('Product.ShelfLife', 'int', 1, 1_000),
  available: z.boolean({
    required_error: 'Product.Available.Required',
  }),
  maxQuantity: zodNumber('Product.MaxQuantity', 'int', 1, 1_000),
});

type ProductModel = z.infer<typeof ProductSchema>;

const PriceRefinement: RefinementParameters<ProductModel> = [
  (data: ProductModel) => data.defaultImportPrice <= data.retailPrice,
  {
    message: 'Product.DefaultImportPrice.LessThan.RetailPrice',
    path: ['defaultImportPrice'],
  },
];

const getRefinedProductSchema = (schema: z.Schema<any>) =>
  schema.refine(...PriceRefinement);

export { ProductSchema, getRefinedProductSchema };
export type { ProductModel };
