import '../../database/mongoose.config';
import { Model, models } from 'mongoose';

import { IExpiration } from './types';

const Expiration = models?.Expiration as Model<IExpiration>;
export default Expiration;
