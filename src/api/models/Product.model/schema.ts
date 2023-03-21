import type { Document } from 'mongoose';
import { Schema } from 'mongoose';

import type { IProduct } from './types';

import { handleReferenceChange } from 'api/base/mongoose/reference';
import { getSlug } from 'api/helpers/slug.helper';

export const productSchema = new Schema<IProduct>(
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
  },
);

productSchema.virtual('slug').get(function () {
  return getSlug(this.name, this._id.toString());
});

productSchema.post('save', function (doc: Document<IProduct>, next) {
  handleReferenceChange({
    action: 'save',
    doc,
    fieldName: 'category',
    referencedFieldName: 'products',
    referencedModelName: 'ProductCategory',
    next,
  });
});

productSchema.post(
  'findOneAndDelete',
  function (doc: Document<IProduct>, next) {
    handleReferenceChange({
      action: 'findOneAndDelete',
      doc,
      fieldName: 'category',
      referencedFieldName: 'products',
      referencedModelName: 'ProductCategory',
      next,
    });
  },
);
