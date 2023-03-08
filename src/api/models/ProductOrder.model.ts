import { Schema, model, models, Types } from 'mongoose';

export interface IProductOrder {
  _id: Types.ObjectId;
  product: Types.ObjectId; // IProduct
  supplier: Types.ObjectId; // ISupplier
  status: Types.ObjectId; // IOrderStatus

  quantity: number;
  unitWholesalePrice: number;
  createdAt: Date;
}

export interface IProductOrderInput
  extends Omit<IProductOrder, '_id' | 'createdAt'> {}

const productOrderSchema = new Schema<IProductOrder>(
  {
    product: {
      ref: 'Product',
      type: Schema.Types.ObjectId,
      required: [true, 'ProductOrder/Product is required'],
    },

    supplier: {
      ref: 'Supplier',
      type: Schema.Types.ObjectId,
      required: [true, 'ProductOrder/Supplier is required'],
    },

    status: {
      ref: 'OrderStatus',
      type: Schema.Types.ObjectId,
      required: [true, 'ProductOrder/Status is required'],
    },

    quantity: {
      type: Number,
      required: [true, 'ProductOrder/Quantity is required'],
      min: [1, 'ProductOrder/Quantity should be at least 1'],
    },

    unitWholesalePrice: {
      type: Number,
      required: [true, 'ProductOrder/UnitWholesalePrice is required'],
      min: [1, 'ProductOrder/UnitWholesalePrice should be at least 1'],
    },
  },
  { timestamps: true, collection: 'productOrders' },
);

const ProductOrder =
  models?.ProductOrder ||
  model<IProductOrder>('ProductOrder', productOrderSchema);
export default ProductOrder;
