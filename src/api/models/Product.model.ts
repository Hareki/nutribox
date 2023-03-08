import { Schema, model, models, Types } from 'mongoose';

import { IExpiration } from './Expiration.model';
import { IProductCategory } from './ProductCategory.model';

import { getSlug } from 'api/helpers/slug.helper';

export interface IProduct {
  _id: Types.ObjectId;
  slug: string;
  imageUrls: string[];
  category: IProductCategory;
  // NOTE: Can't embed Expiration into Product
  //       Because We need to loop through all the expirations and find the top 5 closest expirations to the current date for STATISTICS
  expirations: IExpiration[];

  // NOTE: No need to include these, no task requires it for now
  // cartItems: ICartItem[]
  // customerOrderItems: ICustomerOrderItem[]
  // productOrders: IProductOrder[]

  description: string;
  shelfLife: number;
  available: boolean;
  wholesalePrice: number;
  retailPrice: number;
  hot: boolean;
  name: string;
}

const productSchema = new Schema<IProduct>(
  {
    imageUrls: {
      type: [String],
      required: [true, 'Product/ImageUrls should have at least 1 image'],
      validate: {
        validator: function (imageUrls: string[]) {
          return imageUrls.length > 0;
        },
        message: 'Product/ImageUrls should have at least 1 image',
      },
    },

    category: {
      ref: 'ProductCategory',
      type: Schema.Types.ObjectId,
      required: [true, 'Product/Category is required'],
    },

    expirations: [
      {
        ref: 'Expiration',
        type: Schema.Types.ObjectId,
        default: [],
      },
    ],

    description: {
      type: String,
      required: [true, 'Product/Description is required'],
      maxLength: [500, 'Product/Description should be at most 500 characters'],
      trim: true,
    },

    // shelfLife is in days
    shelfLife: {
      type: Number,
      required: [true, 'Product/ShelfLife is required'],
      min: [1, 'Product/ShelfLife should be at least 1 day'],
    },

    available: {
      type: Boolean,
      default: true,
    },

    // Price is in VND
    wholesalePrice: {
      type: Number,
      required: [true, 'Product/WholesalePrice is required'],
      min: [1, 'Product/WholesalePrice should be greater than 0'],
      validate: {
        validator: function (wholesalePrice: number) {
          return wholesalePrice < this.retailPrice;
        },
        message:
          'Product/WholesalePrice should be less than Product/RetailPrice',
      },
    },

    retailPrice: {
      type: Number,
      required: [true, 'Product/RetailPrice is required'],
      min: [1, 'Product/RetailPrice should be greater than 0'],
      validate: {
        validator: function (retailPrice: number) {
          return retailPrice > this.wholesalePrice;
        },
        message:
          'Product/RetailPrice should be greater than Product/WholesalePrice',
      },
    },

    hot: {
      type: Boolean,
      default: false,
    },

    name: {
      type: String,
      required: [true, 'Product/Name is required'],
      maxLength: [100, 'Product/Name should be at most 100 characters'],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

productSchema.virtual('slug').get(function () {
  return getSlug(this.name);
});

const Product = models?.Product || model<IProduct>('Product', productSchema);
export default Product;
