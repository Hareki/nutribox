import { getTotalGenerator } from './generator.controller';

import SupplierModel from 'api/models/Supplier.model';

export const getTotal = getTotalGenerator(SupplierModel());

const SupplierController = {
  getTotal,
};

export default SupplierController;
