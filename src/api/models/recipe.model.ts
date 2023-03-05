import { Schema, model, models } from 'mongoose';

import { IDish } from './Dish.model';
import { IIngredient } from './Ingredient.model';
import { IUnit } from './Unit.model';

export interface IRecipe {
  _id: Schema.Types.ObjectId;
  ingredient: IIngredient;
  dish: IDish;

  quantity: number;
  unit: IUnit;
}

const recipeSchema = new Schema({
  ingredient: {
    type: Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: [true, 'Ingredient is required'],
  },

  dish: {
    type: Schema.Types.ObjectId,
    ref: 'Dish',
    required: [true, 'Dish is required'],
  },

  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be greater than 0'],
  },

  unit: {
    type: Schema.Types.ObjectId,
    ref: 'Unit',
    required: [true, 'Unit is required'],
  },
});

const Recipe = models?.Recipe || model('Recipe', recipeSchema);
export default Recipe;
