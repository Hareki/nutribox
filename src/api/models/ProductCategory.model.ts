import { Schema, model, models } from 'mongoose';

import { IProduct } from './Product.model';

export interface IProductCategory {
  _id: Schema.Types.ObjectId;
  name: string;

  products: IProduct[];
}

const productCategorySchema = new Schema(
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
  { timestamps: true },
);

const ProductCategory =
  models?.ProductCategory || model('ProductCategory', productCategorySchema);
export default ProductCategory;
