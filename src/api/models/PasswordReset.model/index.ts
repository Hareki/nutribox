import '../../database/mongoose/mongoose.config';
import type { Model } from 'mongoose';
import { models } from 'mongoose';

import type { IPasswordReset } from './types';

const PasswordResetModel = () => models?.PasswordReset as Model<IPasswordReset>;
export default PasswordResetModel;
