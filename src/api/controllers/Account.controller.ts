import { Types } from 'mongoose';

import {
  getAllGenerator,
  getOneGenerator,
  createOneGenerator,
} from './generator.controller';

import {
  populateCartItems,
  validateDocExistence,
} from 'api/helpers/model.helper';
import Account from 'api/models/Account.model';
import { ICartItem } from 'api/models/Account.model/CartItem.schema/types';
import {
  IAccount,
  IPopulatedCartItemsAccount,
} from 'api/models/Account.model/types';
import Product from 'api/models/Product.model';
import { CartState } from 'hooks/redux-hooks/useCart';
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

const getCartItems = async (accountId: string): Promise<CartState> => {
  const account = await Account.findById(accountId).exec();
  validateDocExistence(account, Account, accountId);

  const cartItemsDoc: ICartItem[] = account.cartItems.toObject();
  const populatedCartItems = await populateCartItems(cartItemsDoc);

  const cartState: CartState = {
    cart: populatedCartItems,
  };
  return cartState;
};

const updateCartItem = async (
  accountId: string,
  { productId, quantity }: CartItemRequestBody,
): Promise<IPopulatedCartItemsAccount> => {
  const account = await Account.findById(accountId).exec();
  validateDocExistence(account, Account, accountId);

  const product = await Product.findById(productId).exec();
  validateDocExistence(product, Product, productId);

  const existingCartItemIndex = account.cartItems.findIndex(
    (item) => item.product.toString() === productId,
  );

  if (existingCartItemIndex > -1) {
    if (quantity <= 0) {
      account.cartItems.splice(existingCartItemIndex, 1);
    } else {
      account.cartItems[existingCartItemIndex].quantity = quantity;
    }
  } else if (quantity > 0) {
    account.cartItems.push({
      product: new Types.ObjectId(productId),
      quantity,
    });
  }

  account.save();

  const cartItemsDoc = account.cartItems;
  const populatedCartItems = await populateCartItems(cartItemsDoc);

  const populatedCartItemsAccount = {
    ...(account.toObject() as IAccount),
    cartItems: populatedCartItems,
  };

  return populatedCartItemsAccount;
};

const AccountController = {
  getAll,
  getOne,
  createOne,
  checkCredentials,
  getCartItems,
  updateCartItem,
};
export default AccountController;
