import { CommonService } from '../common/common.service';

import { CommonProductRelations, type CommonProductModel } from './helper';

import { CustomerOrderItemEntity } from 'backend/entities/customerOrderItem.entity';
import { ProductEntity } from 'backend/entities/product.entity';
import { OrderStatus } from 'backend/enums/Entities.enum';
import { getRepo } from 'backend/utils/database.helper';
import type { PopulateProductFields } from 'models/product.model';

export class ProductService {
  public static getProductWithRelatedProducts = async (
    id: string,
    limit = 5,
  ) => {
    const relations: (keyof ProductEntity)[] = [
      'productImages',
      'productCategory',
      'importOrders',
    ];

    type ResponseData = PopulateProductFields<
      'importOrders' | 'productImages' | 'productCategory'
    >;

    const data = (await CommonService.getRecord({
      entity: ProductEntity,
      relations,
      filter: {
        id,
      },
    })) as ResponseData;

    const [relatedProducts] = await CommonService.getRecords({
      entity: ProductEntity,
      relations,
      filter: {
        productCategory: data?.productCategory.id,
      },
      paginationParams: {
        limit: limit,
        page: 1,
      },
    });

    return {
      ...data,
      relatedProducts: relatedProducts as ResponseData[],
    };
  };

  public static getNewProducts = async (limit = 5) => {
    const [newestProducts] = await CommonService.getRecords({
      entity: ProductEntity,
      relations: CommonProductRelations,
      paginationParams: {
        limit,
        page: 1,
      },
    });

    return newestProducts as CommonProductModel[];
  };

  public static getHotProducts = async (limit = 5) => {
    const customerOrderItemRepo = await getRepo(CustomerOrderItemEntity);
    const productRepo = await getRepo(ProductEntity);

    // Get the most sold product IDs
    const mostSoldProducts = await customerOrderItemRepo
      .createQueryBuilder('coi')
      .innerJoinAndSelect('coi.product', 'product')
      .innerJoin('coi.customerOrder', 'co', 'co.status = :status', {
        status: OrderStatus.SHIPPED,
      })
      .select('product.id as product_id')
      .addSelect('SUM(coi.quantity)', 'total_sold')
      .groupBy('product.id')
      .orderBy('total_sold', 'DESC')
      .limit(limit)
      .getRawMany();

    // Get the product entities using their IDs
    const productIds = mostSoldProducts.map((p) => p.product_id);
    const products = (await productRepo.findByIds(productIds, {
      relations: CommonProductRelations,
    })) as CommonProductModel[];

    // Ensure the order of products matches the order of most sold
    return productIds.map((id) => products.find((p) => p.id === id)!);
  };
}
