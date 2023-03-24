import type { ClientSession } from 'mongoose';
import { Types } from 'mongoose';
import type { Session } from 'next-auth';

import type { CartItemRequestBody } from '../../../pages/api/cart/[accountId]';
import type {
  AddAddressRequestBody,
  DeleteAddressQueryParams,
  UpdateAddressRequestBody,
} from '../../../pages/api/profile/address/[accountId]';
import type { SetDefaultAddressRequestBody } from '../../../pages/api/profile/address/default/[accountId]';

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
import AccountModel from 'api/models/Account.model';
import type { IAccountAddress } from 'api/models/Account.model/AccountAddress.schema/types';
import type { ICartItem } from 'api/models/Account.model/CartItem.schema/types';
import type {
  IAccount,
  IPopulatedCartItemsAccount,
} from 'api/models/Account.model/types';
import CustomerOrderModel from 'api/models/CustomerOrder.model';
import ProductModel from 'api/models/Product.model';
import type { CartState } from 'hooks/global-states/useCart';

const getAll = getAllGenerator<IAccount>(AccountModel());
const getOne = getOneGenerator<IAccount>(AccountModel());

const createOne = createOneGenerator<IAccount>(AccountModel());
const updateOne = updateOneGenerator<IAccount>(AccountModel());

const getSessionUser = async (
  accountId: string,
): Promise<Pick<Session, 'user'>> => {
  const account = await getOne({ id: accountId });
  return {
    user: {
      id: account.id,
      avatarUrl: account.avatarUrl,
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
      fullName: account.fullName,
      role: account.role,
    },
  };
};

const checkCredentials = async (
  email: string,
  password: string,
): Promise<IAccount | null> => {
  const account = await AccountModel().findOne({ email }).exec();
  if (!account) return null;

  const isPasswordMatch = await account.isPasswordMatch(
    password,
    account.password,
  );
  if (!isPasswordMatch) return null;

  return account.toObject();
};

const getCartItems = async (accountId: string): Promise<CartState> => {
  const account = await AccountModel().findById(accountId).exec();
  validateDocExistence(account, AccountModel(), accountId);

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
  const account = await AccountModel().findById(accountId).exec();
  validateDocExistence(account, AccountModel(), accountId);

  const product = await ProductModel().findById(productId).exec();
  validateDocExistence(product, ProductModel(), productId);

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

const clearCartItems = async (
  accountId: string,
  session: ClientSession,
): Promise<IAccount> => {
  const account = await AccountModel().findById(accountId).exec();
  validateDocExistence(account, AccountModel(), accountId);

  const idArray = account.cartItems.map((item) => item._id);
  idArray.forEach((id) => {
    account.cartItems.remove(id);
  });

  await account.save({ session });
  return account;
};

const getAddresses = async (accountId: string): Promise<IAccountAddress[]> => {
  const account = await getOne({ id: accountId });
  return account.addresses;
};

const addAddress = async (
  accountId: string,
  address: AddAddressRequestBody,
): Promise<IAccountAddress[]> => {
  const account = await AccountModel().findById(accountId).exec();
  validateDocExistence(account, AccountModel(), accountId);

  account.addresses.push(address);
  account.save();

  return account.toObject().addresses;
};

const updateAddress = async (
  accountId: string,
  address: UpdateAddressRequestBody,
): Promise<IAccountAddress[]> => {
  const account = await AccountModel().findById(accountId).exec();
  validateDocExistence(account, AccountModel(), accountId);

  const addressIndex = account.addresses.findIndex(
    (addr: IAccountAddress) => addr.id === address.id,
  );

  if (addressIndex === -1) {
    throw new CustomError(
      `Address with ID ${address.id} not found`,
      CustomErrorCodes.DOCUMENT_NOT_FOUND,
    );
  }

  for (const key in address) {
    if (Object.prototype.hasOwnProperty.call(address, key)) {
      account.addresses[addressIndex][key] = address[key];
    }
  }

  await account.save();
  return account.toObject().addresses;
};

const setDefaultAddress = async (
  accountId: string,
  address: SetDefaultAddressRequestBody,
): Promise<IAccountAddress[]> => {
  const account = await AccountModel().findById(accountId).exec();
  validateDocExistence(account, AccountModel(), accountId);

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

  const currentDefaultIndex = account.addresses.findIndex(
    (addr: IAccountAddress) => addr.isDefault,
  );
  if (currentDefaultIndex !== -1) {
    account.addresses[currentDefaultIndex].isDefault = false;
  }

  account.addresses[addressIndex].isDefault = true;

  await account.save();
  return account.toObject().addresses;
};

const deleteAddress = async (
  accountId: string,
  params: DeleteAddressQueryParams,
): Promise<IAccountAddress[]> => {
  const account = await AccountModel().findById(accountId).exec();
  validateDocExistence(account, AccountModel(), accountId);

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

const addCustomerOrder = async (
  accountId: string,
  customerOrderId: string,
  session: ClientSession,
): Promise<void> => {
  const account = await AccountModel().findById(accountId);
  account.customerOrders.push(new Types.ObjectId(customerOrderId));
  // Can't use pre/pose save hook to update this, because it will conflict with the session
  await account.save({ session });
};

const countAddress = async (accountId: string): Promise<number> => {
  const account = await AccountModel().findById(accountId).exec();
  const count = account.addresses.length;
  return count;
};

const countOrder = async (accountId: string): Promise<number> => {
  const count = await CustomerOrderModel()
    .find({ account: accountId })
    .countDocuments();

  return count;
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
  clearCartItems,
  getAddresses,
  addAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
  addCustomerOrder,
  countAddress,
  countOrder,
};
export default AccountController;
