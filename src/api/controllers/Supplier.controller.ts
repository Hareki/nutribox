import { getTotalGenerator } from './generator.controller';

import SupplierModel from 'api/models/Supplier.model';
import type { ISupplierDropdown } from 'api/models/Supplier.model/types';

export const getTotal = getTotalGenerator(SupplierModel());

// FIXME could implement a generator for this (cuz it's used in category as well)
export const getDropdown = async (): Promise<ISupplierDropdown[]> => {
  const categories = await SupplierModel()
    .find()
    .select('name')
    .lean({ virtuals: true })
    .exec();

  return categories;
};

const SupplierController = {
  getTotal,
  getDropdown,
};

export default SupplierController;
