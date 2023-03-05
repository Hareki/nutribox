import { Schema, model, models } from 'mongoose';

export interface IRole {
  _id: Schema.Types.ObjectId;
  name: string;
}

const roleSchema = new Schema({
  name: {
    type: String,
    required: [true, 'role name is required'],
    trim: true,
    unique: true,
  },
});

const Role = models?.Role || model('Role', roleSchema);
export default Role;
