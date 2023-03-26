import { getOneGenerator, updateOneGenerator } from './generator.controller';

import StoreModel from 'api/models/Store.model';
import type { IStore } from 'api/models/Store.model/types';

const getOne = getOneGenerator<IStore>(StoreModel());
const updateOne = updateOneGenerator<IStore>(StoreModel());

const StoreController = {
  getOne,
  updateOne,
};

export default StoreController;
