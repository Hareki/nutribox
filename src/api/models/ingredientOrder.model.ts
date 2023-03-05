import { Schema, model, models } from 'mongoose';

import { IIngredient } from './Ingredient.model';
import { IOrderStatus } from './OrderStatus.model';
import { ISupplier } from './Supplier.model';
import { IUnit } from './Unit.model';

export interface IIngredientOrder {
  _id: Schema.Types.ObjectId;
  ingredient: IIngredient;
  supplier: ISupplier;
  orderStatus: IOrderStatus;

  quantity: number;
  unit: IUnit;
}

const ingredientOrderSchema = new Schema(
  {
    ingredient: {
      type: Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: [true, 'Ingredient is required'],
    },

    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
      required: [true, 'Supplier is required'],
    },

    orderStatus: {
      type: Schema.Types.ObjectId,
      ref: 'OrderStatus',
      required: [true, 'Order status is required'],
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
  },
  { timestamps: true },
);

const IngredientOrder =
  models?.IngredientOrder || model('IngredientOrder', ingredientOrderSchema);
export default IngredientOrder;
