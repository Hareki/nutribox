import { Schema } from 'mongoose';

import type { IExpiration } from './types';

export const expirationSchema = new Schema<IExpiration>(
  {
    product: {
      ref: 'Product',
      type: Schema.Types.ObjectId,
      required: [true, 'Expiration/Product is required'],
    },

    importDate: {
      type: Date,
      required: [true, 'Expiration/ExpirationDate is required'],
      validate: {
        validator: function (value: Date) {
          return value.getTime() < this.expirationDate.getTime();
        },
        message: 'Expiration/ExpirationDate should be after ImportDate',
      },
    },

    expirationDate: {
      type: Date,
      required: [true, 'Expiration/ExpirationDate is required'],
      // min: [
      //   new Date(new Date().getTime() + 86400000),
      //   'Expiration/ExpirationDate should be at least 1 day from now',
      // ],
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
// Can't do this duo to session, need to manually do in the transaction

// expirationSchema.pre('save', preSaveWasNew);

// expirationSchema.post('save', function (doc: Document<IExpiration>, next) {
//   if (!doc.wasNew) {
//     next();
//     return;
//   }

//   handleReferenceChange({
//     action: 'save',
//     doc,
//     fieldName: 'product',
//     referencedFieldName: 'expirations',
//     referencedModelName: 'Product',
//     next,
//   });
// });

// expirationSchema.post(
//   'findOneAndDelete',
//   function (doc: Document<IExpiration>, next) {
//     handleReferenceChange({
//       action: 'findOneAndDelete',
//       doc,
//       fieldName: 'product',
//       referencedFieldName: 'expirations',
//       referencedModelName: 'Product',
//       next,
//     });
//   },
// );
