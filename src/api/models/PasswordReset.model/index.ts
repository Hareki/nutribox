import '../../database/mongoose.config';
import type { Model } from 'mongoose';
import { models } from 'mongoose';

import type { IPasswordReset } from './types';

const PasswordReset = models?.PasswordReset as Model<IPasswordReset>;
export default PasswordReset;
