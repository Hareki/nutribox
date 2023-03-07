import { Schema, model, models } from 'mongoose';

export interface IProductCategory {
  _id: Schema.Types.ObjectId;
  name: string;
}

const productCategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'ProductCategory/Name is required'],
    maxLength: [50, 'ProductCategory/Name should be at most 50 characters'],
    unique: true,
    trim: true,
  },
});

const ProductCategory =
  models?.ProductCategory || model('ProductCategory', productCategorySchema);
export default ProductCategory;
