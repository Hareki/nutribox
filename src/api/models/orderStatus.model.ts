import { Schema, model, models } from 'mongoose';

export interface IOrderStatus {
  _id: Schema.Types.ObjectId;
  name: string;
}

const orderStatusSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Order status name is required'],
    trim: true,
    unique: true,
  },
});

const OrderStatus =
  models?.OrderStatus || model('OrderStatus', orderStatusSchema);
export default OrderStatus;
