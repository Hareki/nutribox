import { Schema, model, models } from 'mongoose';

export interface IDishCategory {
  _id: Schema.Types.ObjectId;
  name: string;
}

const dishCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Dish category name is required'],
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const DishCategory =
  models?.DishCategory || model('DishCategory', dishCategorySchema);
export default DishCategory;
