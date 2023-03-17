import '../../database/mongoose.config';

import type { Model } from 'mongoose';
import { models } from 'mongoose';

import type { IAccount } from './types';

const Account = models.Account as Model<IAccount>;
export default Account;
