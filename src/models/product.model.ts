import { z } from 'zod';

import type { CartItemModel } from './cartItem.model';
import {
  zodString,
  type RefinementParameters,
  zodNumber,
  zodUuid,
  zodDate,
} from './helper';
import type { ImportOrderModel } from './importOder.model';
import type { ProductCategoryModel } from './productCategory.model';
import type { ProductImageModel } from './productImage.model';
import type { SupplierModel } from './supplier.model';

const ProductSchema = z.object({
  id: zodUuid('Product.Id'),

  createdAt: zodDate('Product.CreatedAt'),

  productCategory: zodUuid('Product.ProductCategoryId'),

  productImages: z.array(z.string().uuid()).optional(),

  cartItems: z.array(z.string().uuid()).optional(),

  customerOrderItems: z.array(z.string().uuid()).optional(),

  importOrders: z.array(z.string().uuid()).optional(),

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

type ProductReferenceKeys = keyof Pick<
  ProductModel,
  | 'productCategory'
  | 'defaultSupplierId'
  | 'productImages'
  | 'cartItems'
  | 'importOrders'
>;

type PopulateField<K extends keyof ProductModel> = K extends 'category'
  ? ProductCategoryModel
  : K extends 'defaultSupplierId'
  ? SupplierModel
  : K extends 'productImages'
  ? ProductImageModel[]
  : K extends 'cartItems'
  ? CartItemModel[]
  : K extends 'importOrders'
  ? ImportOrderModel[]
  : never;

type PopulateProductFields<K extends ProductReferenceKeys> = Omit<
  ProductModel,
  K
> & {
  [P in K]: PopulateField<P>;
};

type FullyPopulatedProductModel = PopulateProductFields<ProductReferenceKeys>;

export { ProductSchema, getRefinedProductSchema };
export type { ProductModel, FullyPopulatedProductModel, PopulateProductFields };
