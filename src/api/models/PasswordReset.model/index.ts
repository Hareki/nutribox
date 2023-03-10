import '../../database/mongoose.config';
import { Model, models } from 'mongoose';

import { IPasswordReset } from './types';

const PasswordReset = models?.PasswordReset as Model<IPasswordReset>;
export default PasswordReset;
