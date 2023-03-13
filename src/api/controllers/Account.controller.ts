import {
  getAllGenerator,
  getOneGenerator,
  createOneGenerator,
} from './base.controller';

import Account from 'api/models/Account.model';
import { IAccount } from 'api/models/Account.model/types';

export const getAll = getAllGenerator<IAccount>(Account);
export const getOne = getOneGenerator<IAccount>(Account);

export const createOne = createOneGenerator<IAccount>(Account);

const AccountController = {
  getAll,
  getOne,
  createOne,
};
export default AccountController;
