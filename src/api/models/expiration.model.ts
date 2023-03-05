import { Schema, model, models } from 'mongoose';

import { IIngredient } from './Ingredient.model';
import { IUnit } from './Unit.model';

export interface IExpiration {
  _id: Schema.Types.ObjectId;
  ingredient: IIngredient;

  quantity: number;
  unit: IUnit;
  expirationDate: Date;
}

const expirationSchema = new Schema(
  {
    ingredient: {
      type: Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: [true, 'Expiration ingredient is required'],
    },

    quantity: {
      type: Number,
      required: [true, 'Expiration quantity is required'],
      min: [0, 'Expiration quantity must be greater than or equal to zero'],
    },

    unit: {
      type: Schema.Types.ObjectId,
      ref: 'Unit',
      required: [true, 'Ingredient unit is required'],
    },

    expirationDate: {
      type: Date,
      required: [true, 'Expiration date is required'],
    },
  },
  { timestamps: true },
);

const Expiration = models?.Expiration || model('Expiration', expirationSchema);
export default Expiration;
