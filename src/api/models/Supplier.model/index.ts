import '../../database/mongoose.config';
import type { Model } from 'mongoose';
import { models } from 'mongoose';

import type { ISupplier } from './types';

const SupplierModel = () => models?.Supplier as Model<ISupplier>;
export default SupplierModel;
