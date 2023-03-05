import { Schema, model, models } from 'mongoose';

import { IDishCategory } from './DishCategory.model';
import { IIngredient } from './Ingredient.model';

export interface IDish {
  _id: string;
  category: IDishCategory;
  ingredients: IIngredient[];
  imageUrls: string[];

  available: boolean;
  cost: number;
  price: number;
  name: string;
  energy: number;
  description: string;
}

const dishSchema = new Schema(
  {
    _id: {
      type: String,
      required: [true, 'Dish Id is required'],
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: 'DishCategory',
      required: [true, 'Dish category is required'],
    },

    // MANDATORY one or more ingredients
    ingredients: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Ingredient',
        validate: {
          validator: function (items: any[]) {
            return items && items.length > 0;
          },
          message: 'Dish must be made of at least 1 ingredient',
        },
        required: [true, 'Dish must be made of at least 1 ingredient'],
      },
    ],

    imageUrls: {
      type: [String],
      required: [true, 'Dish image url(s) are required'],
      validate: {
        validator: function (value: string[]) {
          return value && value.length > 0;
        },
        message: 'Dish must have at least 1 image url',
      },
    },

    available: {
      type: Boolean,
      required: [true, 'Dish availability is required'],
    },

    cost: {
      type: Number,
      required: [true, 'Dish cost is required'],
      min: [1, 'Dish cost must be greater than zero'],
      validate: {
        validator: function (cost: number) {
          return cost < this.price;
        },
        message: 'Cost must be smaller than price',
      },
    },

    price: {
      type: Number,
      required: [true, 'Dish price is required'],
      min: [1, 'Dish price must be greater than zero'],
      validate: {
        validator: function (price: number) {
          return price > this.cost;
        },
        message: 'Price must be greater than cost',
      },
    },

    name: {
      type: String,
      required: [true, 'Dish name is required'],
      trim: true,
      unique: true,
    },

    // In calories
    energy: {
      type: Number,
      required: [true, 'Dish energy is required'],
      min: [1, 'Dish energy must be greater than zero'],
    },

    description: {
      type: String,
      required: [true, 'Dish description is required'],
      trim: true,
      validate: {
        validator: (value: string) => {
          return !value || value.length <= 500;
        },
        message: 'Description must be at most 500 characters',
      },
    },
  },
  { timestamps: true },
);

const Dish = models?.Dish || model('Dish', dishSchema);
export default Dish;
