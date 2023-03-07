import { Schema, model, models } from 'mongoose';

import { IOrderStatus } from './OrderStatus.model';
import { IProduct } from './Product.model';
import { ISupplier } from './Supplier.model';

export interface IProductOrder {
  _id: Schema.Types.ObjectId;
  product: IProduct;
  supplier: ISupplier;
  status: IOrderStatus;

  quantity: number;
  unitWholesalePrice: number;
  createdAt: Date;
}

const productOrderSchema = new Schema(
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
  { timestamps: true },
);

const ProductOrder =
  models?.ProductOrder || model('ProductOrder', productOrderSchema);
export default ProductOrder;
