import { Schema, model, models, Types } from 'mongoose';

export interface IOrderStatus {
  _id: Types.ObjectId;
  name: string;

  // NOTE: No need to include these, no task requires it for now
  // productOrders: IProductOrder[];
  // customersOrders: ICustomerOrder[];
}

export interface IOrderStatusInput extends Omit<IOrderStatus, '_id'> {}

const orderStatusSchema = new Schema<IOrderStatus>(
  {
    name: {
      type: String,
      required: [true, 'OrderStatus/Name is required'],
      maxLength: [50, 'OrderStatus/Name should be at most 50 characters'],
      unique: true,
      trim: true,
    },
  },
  { collection: 'orderStatuses' },
);

const OrderStatus =
  models?.OrderStatus || model<IOrderStatus>('OrderStatus', orderStatusSchema);
export default OrderStatus;
