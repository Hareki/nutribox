import { Schema, model, models, Types } from 'mongoose';

import { IProduct } from './Product.model';

import { getSlug } from 'api/helpers/slug.helper';

export interface IProductCategory {
  _id: Types.ObjectId;
  slug: string;
  name: string;

  products: IProduct[];
}

const productCategorySchema = new Schema<IProductCategory>(
  {
    name: {
      type: String,
      required: [true, 'ProductCategory/Name is required'],
      maxLength: [100, 'ProductCategory/Name should be at most 100 characters'],
      unique: true,
      trim: true,
    },

    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        default: [],
      },
    ],
  },
  { timestamps: true, collection: 'productCategories' },
);

productCategorySchema.virtual('slug').get(function () {
  return getSlug(this.name);
});

const ProductCategory =
  models?.ProductCategory ||
  model<IProductCategory>('ProductCategory', productCategorySchema);
export default ProductCategory;
