import { Schema, model, models } from 'mongoose';

export interface IOrderStatus {
  _id: Schema.Types.ObjectId;
  name: string;
}

const orderStatusSchema = new Schema({
  name: {
    type: String,
    required: [true, 'OrderStatus/Name is required'],
    maxLength: [50, 'OrderStatus/Name should be at most 50 characters'],
    unique: true,
    trim: true,
  },
});

const OrderStatus =
  models?.OrderStatus || model('OrderStatus', orderStatusSchema);
export default OrderStatus;
