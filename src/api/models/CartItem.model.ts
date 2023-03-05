import { Schema, model, models } from 'mongoose';

import { IAccount } from './Account.model';
import { IDish } from './Dish.model';

export interface ICartItem {
  _id: Schema.Types.ObjectId;
  dish: IDish;
  account: IAccount;
  quantity: number;
}

const CartItemSchema = new Schema({
  dish: {
    type: Schema.Types.ObjectId,
    ref: 'Dish',
    required: [true, 'Cart Item dish is required'],
  },

  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'Cart Item account is required'],
  },

  quantity: {
    type: Number,
    required: [true, 'Cart Item quantity is required'],
    min: [1, 'Cart Item quantity must be at least 1'],
  },
});

const CartItem = models?.CartItem || model('CartItem', CartItemSchema);
export default CartItem;
