import '../../database/mongoose.config';
import type { Model } from 'mongoose';
import { models } from 'mongoose';

import type { IStore } from './types';

const StoreModel = () => models?.Store as Model<IStore>;
export default StoreModel;
