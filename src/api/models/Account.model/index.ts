import '../../database/mongoose/mongoose.config';

import type { Model } from 'mongoose';
import { models } from 'mongoose';

import type { IAccount } from './types';

const AccountModel = () => models?.Account as Model<IAccount>;
export default AccountModel;
