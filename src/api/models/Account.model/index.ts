import '../../database/mongoose.config';

import { models, Model } from 'mongoose';

import { IAccount } from './types';

const Account = models.Account as Model<IAccount>;
export default Account;
