import { Schema, model, models } from 'mongoose';

import { IExpiration } from './Expiration.model';
import { IUnit } from './Unit.model';

export interface IIngredient {
  _id: Schema.Types.ObjectId;
  unit: IUnit;
  expirations: IExpiration[];

  name: string;
  cost: number;
  shelfLife: number;
}

const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Ingredient name is required'],
      trim: true,
      unique: true,
    },
    cost: {
      type: Number,
      required: [true, 'Ingredient cost is required'],
      min: [1, 'Ingredient cost must be greater than zero'],
      validate: {
        validator: function (cost: number) {
          return cost < this.price;
        },
        message: 'Cost must be smaller than price',
      },
    },

    // In days
    shelfLife: {
      type: Number,
      required: [true, 'Ingredient shelf life is required'],
      min: [1, 'Ingredient shelf life must be greater than zero'],
    },

    unit: {
      type: Schema.Types.ObjectId,
      ref: 'Unit',
      required: [true, 'Ingredient unit is required'],
    },

    // OPTIONAL one or more expirations
    expirations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Expiration',
      },
    ],
  },
  { timestamps: true },
);

const Ingredient = models?.Ingredient || model('Ingredient', ingredientSchema);
export default Ingredient;
