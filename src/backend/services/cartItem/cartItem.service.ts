import { CommonService } from '../common/common.service';
import type { CommonCartItem, CommonProductModel } from '../product/helper';
import { ProductService } from '../product/product.service';

import { CartItemEntity } from 'backend/entities/cartItem.entity';
import { isEntityNotFoundError } from 'backend/helpers/validation.helper';
import type { CartItemModel } from 'models/cartItem.model';

export class CartItemService {
  public static async getCartItems(
    customerId: string,
  ): Promise<CommonCartItem[]> {
    const [cartItems] = await CommonService.getRecords({
      entity: CartItemEntity,
      filter: {
        customer: {
          id: customerId,
        },
      },
    });

    const commonProductIds = cartItems.map(
      (cartItem) => cartItem.product as string,
    );
    const [commonProducts] = await ProductService.getCommonProducts({
      whereInIds: commonProductIds,
    });

    const castedCartItems = cartItems as CartItemModel[];
    const castedCommonProducts = commonProducts as CommonProductModel[];

    return castedCartItems.map((cartItem) => {
      const commonProduct = castedCommonProducts.find(
        (product) => product.id === cartItem.product,
      );

      return {
        ...cartItem,
        product: commonProduct!,
      };
    });
  }

  public static async updateCartItem(
    customerId: string,
    productId: string,
    quantity: number,
  ): Promise<CommonCartItem[]> {
    // const cartItemRepository = await getRepo(CartItemEntity);

    try {
      const existingCartItem = await CommonService.getRecord({
        entity: CartItemEntity,
        filter: {
          customer: { id: customerId },
          product: { id: productId },
        },
      });

      if (quantity === 0) {
        // await cartItemRepository.remove(existingCartItem);
        await CommonService.deleteRecord(CartItemEntity, existingCartItem.id);
      } else if (quantity > 0) {
        existingCartItem.quantity = quantity;
        // await cartItemRepository.save(existingCartItem);
        await CommonService.updateRecord(
          CartItemEntity,
          existingCartItem.id,
          existingCartItem,
        );
      }

      return this.getCartItems(customerId);
    } catch (error) {
      if (isEntityNotFoundError(error)) {
        if (quantity > 0) {
          // const newCartItem = new CartItemEntity();
          // newCartItem.customer = customerId;
          // newCartItem.product = productId;
          // newCartItem.quantity = quantity;
          // await cartItemRepository.save(newCartItem);
          await CommonService.createRecord(CartItemEntity, {
            customer: { id: customerId },
            product: { id: productId },
            quantity,
          });
        }
        return this.getCartItems(customerId);
      }
      throw error;
    }
  }
}
