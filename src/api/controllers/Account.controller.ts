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

export const checkCredentials = async (
  email: string,
  password: string,
): Promise<IAccount | null> => {
  const account = await Account.findOne({ email }).exec();
  if (!account) return null;

  const isPasswordMatch = await account.isPasswordMatch(
    password,
    account.password,
  );
  if (!isPasswordMatch) return null;

  return account.toObject();
};

const AccountController = {
  getAll,
  getOne,
  createOne,
  checkCredentials,
};
export default AccountController;
