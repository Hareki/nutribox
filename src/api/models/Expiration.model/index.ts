import '../../database/mongoose.config';
import type { Model } from 'mongoose';
import { models } from 'mongoose';

import type { IExpiration } from './types';

const ExpirationModel = () => models?.Expiration as Model<IExpiration>;
export default ExpirationModel;
