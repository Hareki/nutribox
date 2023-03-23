import type { Document } from 'mongoose';
import { Schema } from 'mongoose';

import type { IExpiration } from './types';

import { handleReferenceChange } from 'api/base/mongoose/reference';

export const expirationSchema = new Schema<IExpiration>(
  {
    product: {
      ref: 'Product',
      type: Schema.Types.ObjectId,
      required: [true, 'Expiration/Product is required'],
    },

    expirationDate: {
      type: Date,
      required: [true, 'Expiration/ExpirationDate is required'],
      min: [
        new Date(new Date().getTime() + 86400000),
        'Expiration/ExpirationDate should be at least 1 day from now',
      ],
    },

    quantity: {
      type: Number,
      required: [true, 'Expiration/Quantity is required'],
    },
  },
  {
    timestamps: true,
  },
);

expirationSchema.post('save', function (doc: Document<IExpiration>, next) {
  if (!doc.isNew) next();

  handleReferenceChange({
    action: 'save',
    doc,
    fieldName: 'product',
    referencedFieldName: 'expirations',
    referencedModelName: 'Product',
    next,
  });
});

expirationSchema.post(
  'findOneAndDelete',
  function (doc: Document<IExpiration>, next) {
    handleReferenceChange({
      action: 'findOneAndDelete',
      doc,
      fieldName: 'product',
      referencedFieldName: 'expirations',
      referencedModelName: 'Product',
      next,
    });
  },
);
