import { Types } from 'mongoose';

import {
  getAllGenerator,
  getOneGenerator,
  createOneGenerator,
} from './base.controller';

import Account from 'api/models/Account.model';
import { IAccount } from 'api/models/Account.model/types';
import Product from 'api/models/Product.model';
import { CartItemRequestBody } from 'utils/apiCallers/global/cart';

const getAll = getAllGenerator<IAccount>(Account);
const getOne = getOneGenerator<IAccount>(Account);

const createOne = createOneGenerator<IAccount>(Account);

const checkCredentials = async (
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

const updateCart = async ({
  accountId,
  productId,
  quantity,
}: CartItemRequestBody): Promise<IAccount> => {
  const account = await Account.findById(accountId).exec();
  if (!account) {
    throw new Error(
      `Document ${Account.baseModelName} with id ${accountId} not found`,
    );
  }

  const product = await Product.findById(productId).exec();
  if (!product) {
    throw new Error(
      `Document ${Product.baseModelName} with id ${productId} not found`,
    );
  }

  account.cartItems.push({ product: new Types.ObjectId(productId), quantity });
  account.save();
  return account.toObject();
};

const AccountController = {
  getAll,
  getOne,
  createOne,
  checkCredentials,
  updateCart,
};
export default AccountController;
