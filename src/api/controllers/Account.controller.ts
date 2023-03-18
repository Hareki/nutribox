import { Types } from 'mongoose';
import type { Session } from 'next-auth';

import type {
  AddAddressRequestBody,
  DeleteAddressQueryParams,
  UpdateAddressRequestBody,
} from '../../../pages/api/address/[accountId]';
import type { CartItemRequestBody } from '../../../pages/api/cart/[accountId]';

import {
  getAllGenerator,
  getOneGenerator,
  createOneGenerator,
  updateOneGenerator,
} from './generator.controller';

import { CustomError, CustomErrorCodes } from 'api/helpers/error.helper';
import {
  populateCartItems,
  validateDocExistence,
} from 'api/helpers/model.helper';
import Account from 'api/models/Account.model';
import type { IAccountAddress } from 'api/models/Account.model/AccountAddress.schema/types';
import type { ICartItem } from 'api/models/Account.model/CartItem.schema/types';
import type {
  IAccount,
  IPopulatedCartItemsAccount,
} from 'api/models/Account.model/types';
import Product from 'api/models/Product.model';
import type { CartState } from 'hooks/redux-hooks/useCart';

const getAll = getAllGenerator<IAccount>(Account);
const getOne = getOneGenerator<IAccount>(Account);

const createOne = createOneGenerator<IAccount>(Account);
const updateOne = updateOneGenerator<IAccount>(Account);

const getSessionUser = async (
  accountId: string,
): Promise<Pick<Session, 'user'>> => {
  const account = await getOne({ id: accountId });
  return {
    user: {
      id: account.id,
      avatarUrl: account.avatarUrl,
      email: account.email,
      fullName: account.fullName,
      role: account.role,
    },
  };
};

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

const getAddresses = async (accountId: string): Promise<IAccountAddress[]> => {
  const account = await getOne({ id: accountId });
  return account.addresses;
};

const addAddress = async (
  accountId: string,
  address: AddAddressRequestBody,
): Promise<IAccountAddress[]> => {
  const account = await Account.findById(accountId).exec();
  validateDocExistence(account, Account, accountId);

  account.addresses.push(address);
  account.save();

  return account.toObject().addresses;
};

const updateAddress = async (
  accountId: string,
  address: UpdateAddressRequestBody,
): Promise<IAccountAddress[]> => {
  const account = await Account.findById(accountId).exec();
  validateDocExistence(account, Account, accountId);

  const addressIndex = account.addresses.findIndex(
    (addr: IAccountAddress) => addr.id === address.id,
  );

  delete address.id;

  if (addressIndex === -1) {
    throw new CustomError(
      `Address with ID ${address.id} not found`,
      CustomErrorCodes.DOCUMENT_NOT_FOUND,
    );
  }

  account.addresses[addressIndex] = {
    ...(account.addresses[addressIndex] as any),
    ...address,
  };

  await account.save();
  return account.toObject().addresses;
};

const deleteAddress = async (
  accountId: string,
  params: DeleteAddressQueryParams,
): Promise<IAccountAddress[]> => {
  const account = await Account.findById(accountId).exec();
  validateDocExistence(account, Account, accountId);

  const addressIndex = account.addresses.findIndex(
    (addr: IAccountAddress) => addr.id === params.addressId,
  );

  if (addressIndex === -1) {
    return account.toObject().addresses;
  }

  account.addresses.splice(addressIndex, 1);

  await account.save();
  return account.toObject().addresses;
};

const AccountController = {
  getAll,
  getOne,
  createOne,
  updateOne,
  getSessionUser,
  checkCredentials,
  getCartItems,
  updateCartItem,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};
export default AccountController;
