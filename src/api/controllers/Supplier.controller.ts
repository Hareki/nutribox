import {
  createOneGenerator,
  getAllGenerator,
  getOneGenerator,
  getTotalGenerator,
  updateOneGenerator,
} from './generator.controller';

import SupplierModel from 'api/models/Supplier.model';
import type {
  ISupplier,
  ISupplierDropdown,
} from 'api/models/Supplier.model/types';

const getOne = getOneGenerator<ISupplier>(SupplierModel());
const getAll = getAllGenerator<ISupplier>(SupplierModel());
const createOne = createOneGenerator<ISupplier>(SupplierModel());
const getTotal = getTotalGenerator(SupplierModel());

const updateOne = updateOneGenerator<ISupplier>(SupplierModel());

// FIXME could implement a generator for this (cuz it's used in category as well)
const getDropdown = async (): Promise<ISupplierDropdown[]> => {
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
  getAll,
  getOne,
  updateOne,
  createOne,
};

export default SupplierController;
