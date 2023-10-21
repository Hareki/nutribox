import type {
  GetRecordInputs,
  GetRecordsByKeywordInputs,
  GetRecordsInputs,
} from '../common/helper';

import type { ProductEntity } from 'backend/entities/product.entity';
import type { CartItemModel } from 'models/cartItem.model';
import type { PopulateProductFields } from 'models/product.model';

export type CommonProductModel = PopulateProductFields<
  'importOrders' | 'productImages' | 'productCategory'
>;

export type ExtendedCommonProductModel = PopulateProductFields<
  'importOrders' | 'productImages' | 'productCategory' | 'defaultSupplier'
>;

// for customer usages
export const CommonProductRelations: (keyof ProductEntity)[] = [
  'productImages',
  'productCategory',
  'importOrders',
];

export type GetCommonProductModelInputs = Omit<
  GetRecordInputs<ProductEntity>,
  'entity'
> & {
  extended?: boolean;
};

export type GetCommonProductModelsInputs = Omit<
  GetRecordsInputs<ProductEntity>,
  'entity'
> & {
  extended?: boolean;
};

export type GetCommonProductModelsByKeywordInputs = Omit<
  GetRecordsByKeywordInputs<ProductEntity>,
  'entity'
> & {
  extended?: boolean;
};

// for staff usages
export const ExtendedCommonProductRelations: (keyof ProductEntity)[] = [
  ...CommonProductRelations,
  'defaultSupplier',
];

export type CommonCartItem = Omit<
  CartItemModel,
  'product' | 'customer' | 'id' | 'createdAt'
> & {
  product: CommonProductModel;
};

export type ProductDetailWithRelated = CommonProductModel & {
  relatedProducts: CommonProductModel[];
};
