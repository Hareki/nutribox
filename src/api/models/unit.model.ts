import { Schema, model, models } from 'mongoose';

export interface IUnit {
  _id: Schema.Types.ObjectId;
  name: string;
}

const unitSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Unit name is required'],
    trim: true,
    unique: true,
  },
});

const Unit = models?.Unit || model('Unit', unitSchema);
export default Unit;
