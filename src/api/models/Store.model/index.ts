import '../../database/mongoose.config';
import { Model, models } from 'mongoose';

import { IStore } from './types';

const Store = models.Store as Model<IStore>;
export default Store;
