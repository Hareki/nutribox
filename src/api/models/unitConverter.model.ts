import { Schema, model, models } from 'mongoose';

import { IUnit } from './Unit.model';

export interface IUnitConverter {
  _id: Schema.Types.ObjectId;
  fromUnit: IUnit;
  toUnit: IUnit;
  conversionRate: number;
}

const unitConverterSchema = new Schema({
  fromUnit: {
    type: Schema.Types.ObjectId,
    ref: 'Unit',
    required: [true, 'Unit fromUnit is required'],
  },

  toUnit: {
    type: Schema.Types.ObjectId,
    ref: 'Unit',
    required: [true, 'Unit toUnit is required'],
  },

  conversionRate: {
    type: Number,
    required: [true, 'Unit conversionRate is required'],
    min: [0, 'Unit conversion rate must be greater than or equal to zero'],
  },
});

const UnitConverter =
  models?.UnitConverter || model('UnitConverter', unitConverterSchema);
export default UnitConverter;
