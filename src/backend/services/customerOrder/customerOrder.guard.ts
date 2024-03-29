import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextHandler } from 'next-connect';

import { CommonService } from '../common/common.service';

import { CustomerOrderService } from './customerOrder.service';

import type { CheckoutDto } from 'backend/dtos/checkout.dto';
import { CartItemEntity } from 'backend/entities/cartItem.entity';
import { getSessionCustomerAccount } from 'backend/helpers/auth2.helper';
import { isEntityNotFoundError } from 'backend/helpers/validation.helper';
import { getFullAddress } from 'helpers/address.helper';
import type { PopulateCartItemFields } from 'models/cartItem.model';

export const createCartItemAccessGuard =
  () =>
  async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const account = await getSessionCustomerAccount(req, res);
    const dto = req.body as CheckoutDto;
    const cartItemRequestedNumber = dto.cartItems.length;

    try {
      const [foundCartItems] = await CommonService.getRecords({
        entity: CartItemEntity,
        whereInIds: dto.cartItems,
        filter: {
          customer: {
            id: account?.customer.id || '',
          },
        },
      });

      const validCartItemNumber = foundCartItems.length;
      if (validCartItemNumber !== cartItemRequestedNumber) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: 'fail',
          data: {
            message: 'Some cart items are not found',
            requested: dto.cartItems,
            found: foundCartItems,
          },
        });
      }

      return next();
    } catch (error) {
      if (isEntityNotFoundError(error)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          status: 'fail',
          message: 'You are not authorized access this resource',
        });
      }
      throw error;
    }
  };

export const createCheckoutValidationGuard =
  () =>
  async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const customerAddress = await getFullAddress(req.body as CheckoutDto);
    const cartItemIds = (req.body as CheckoutDto).cartItems;

    const [cartItemsWithProducts] = await CommonService.getRecords({
      entity: CartItemEntity,
      relations: ['product'],
      whereInIds: cartItemIds,
    });

    const castedCartItemsWithProducts =
      cartItemsWithProducts as PopulateCartItemFields<'product'>[];

    const unavailableProducts = castedCartItemsWithProducts.filter(
      (cartItem) => !cartItem.product.available,
    );

    if (unavailableProducts.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'fail',
        message: 'Some products are not available',
        data: {
          unavailableProducts,
        },
      });
    }

    const checkoutValidation =
      await CustomerOrderService.getCheckoutValidation(customerAddress);

    req.body.checkoutValidation = checkoutValidation;

    if (!checkoutValidation.isValidDistance) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'fail',
        data: {
          distance: 'CustomerOrder.Distance.TooFar',
        },
      });
    }
    if (!checkoutValidation.isValidDuration) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'fail',
        data: {
          duration: 'CustomerOrder.Duration.TooLong',
        },
      });
    }
    if (!checkoutValidation.isValidTime) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'fail',
        data: {
          workTime: 'CustomerOrder.WorkTime.Outside',
        },
      });
    }

    return next();
  };
