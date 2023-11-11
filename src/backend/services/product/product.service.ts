import { addDays } from 'date-fns';
import { MoreThan } from 'typeorm';

import { CommonService } from '../common/common.service';

import type {
  ExtendedCommonProductModel,
  GetCommonProductModelInputs,
  GetCommonProductModelsByKeywordInputs,
  GetCommonProductModelsInputs,
  ProductDetailWithRelated,
} from './helper';
import { type CommonProductModel } from './helper';

import type { ImportProductDto } from 'backend/dtos/product/importProduct.dto';
import { CustomerOrderItemEntity } from 'backend/entities/customerOrderItem.entity';
import { ImportOrderEntity } from 'backend/entities/importOrder.entity';
import { ProductEntity } from 'backend/entities/product.entity';
import { ProductImageEntity } from 'backend/entities/productImage.entity';
import { OrderStatus } from 'backend/enums/entities.enum';
import { getRepo } from 'backend/helpers/database.helper';
import type { ImportOrderModel } from 'models/importOder.model';
import { getSlug } from 'utils/string.helper';

export class ProductService {
  private static getMergedRelations = (
    extended: boolean,
    moreRelations?: (keyof ProductEntity)[],
  ) => {
    const relations: (keyof ProductEntity)[] = [
      'productImages',
      'productCategory',
    ];
    if (extended) {
      relations.push('defaultSupplier');
    }
    return [...relations, ...(moreRelations || [])];
  };

  // Helper method to fetch import orders
  private static getRemainingQuantity = async (productId: string) => {
    const [validImportOrders] = await CommonService.getRecords({
      entity: ImportOrderEntity,
      filter: {
        product: {
          id: productId,
        },
        expirationDate: MoreThan(new Date()),
      },
    });

    const remainingQuantity = validImportOrders.reduce((max, importOrder) => {
      max += importOrder.remainingQuantity;
      return max;
    }, 0);

    return remainingQuantity;
  };

  public static getCommonProduct = async <
    T extends
      | CommonProductModel
      | ExtendedCommonProductModel = CommonProductModel,
  >(
    inputs: GetCommonProductModelInputs,
  ): Promise<T> => {
    const {
      extended = false,
      relations: moreRelations,
      ...baseInputs
    } = inputs;

    const relations = ProductService.getMergedRelations(
      extended,
      moreRelations,
    );

    const product = await CommonService.getRecord({
      entity: ProductEntity,
      relations,
      ...baseInputs,
    });

    const remainingQuantity = await ProductService.getRemainingQuantity(
      product.id,
    );

    return {
      ...product,
      remainingQuantity,
    } as T;
  };

  public static getCommonProducts = async <
    T extends
      | CommonProductModel
      | ExtendedCommonProductModel = CommonProductModel,
  >(
    inputs: GetCommonProductModelsInputs,
  ): Promise<[T[], number, number, number]> => {
    const {
      extended = false,
      relations: moreRelations,
      ...baseInputs
    } = inputs;
    const relations = ProductService.getMergedRelations(
      extended,
      moreRelations,
    );

    const [products, totalRecord, nextPageNum, totalPages] =
      await CommonService.getRecords({
        entity: ProductEntity,
        relations,
        ...baseInputs,
      });

    const records = await Promise.all(
      products.map(async (product) => {
        const remainingQuantity = await ProductService.getRemainingQuantity(
          product.id,
        );

        return {
          ...product,
          remainingQuantity,
        } as T;
      }),
    );

    return [records, totalRecord, nextPageNum, totalPages];
  };

  public static getCommonProductsByKeyword = async <
    T extends
      | CommonProductModel
      | ExtendedCommonProductModel = CommonProductModel,
  >(
    inputs: GetCommonProductModelsByKeywordInputs,
  ): Promise<T[]> => {
    const {
      extended = false,
      relations: moreRelations,
      ...baseInputs
    } = inputs;
    const relations = ProductService.getMergedRelations(
      extended,
      moreRelations,
    );

    const products = await CommonService.getRecordsByKeyword({
      entity: ProductEntity,
      relations,
      ...baseInputs,
    });

    const records = await Promise.all(
      products.map(async (product) => {
        const remainingQuantity = await ProductService.getRemainingQuantity(
          product.id,
        );

        return {
          ...product,
          remainingQuantity,
        } as T;
      }),
    );

    return records;
  };

  public static getProductWithRelatedProducts = async (
    id: string,
    limit = 5,
  ): Promise<ProductDetailWithRelated> => {
    const data = await this.getCommonProduct({
      filter: {
        id,
      },
    });

    const [relatedProducts] = await this.getCommonProducts({
      filter: {
        productCategory: data?.productCategory.id,
      },
      paginationParams: {
        limit,
        page: 1,
      },
    });

    return {
      ...data,
      relatedProducts,
    };
  };

  public static getNewProducts = async (
    limit = 5,
  ): Promise<CommonProductModel[]> => {
    const [newestProducts] = await this.getCommonProducts({
      paginationParams: {
        limit,
        page: 1,
      },
      filter: {
        available: true,
        productCategory: { available: true },
      },
    });

    return newestProducts as CommonProductModel[];
  };

  public static getHotProducts = async (limit = 5) => {
    const customerOrderItemRepo = await getRepo(CustomerOrderItemEntity);

    // Get the most sold product IDs
    const mostSoldProducts = await customerOrderItemRepo
      .createQueryBuilder('coi')
      .innerJoinAndSelect('coi.product', 'product')
      .innerJoin('coi.customerOrder', 'co', 'co.status = :status', {
        status: OrderStatus.SHIPPED,
      })
      .innerJoin('product.productCategory', 'pc', 'pc.available = true')
      .where('product.available = true')
      .select('product.id as product_id')
      .addSelect('SUM(coi.quantity)', 'total_sold')
      .groupBy('product.id')
      .orderBy('total_sold', 'DESC')
      .limit(limit)
      .getRawMany();

    // Get the product entities using their IDs
    const productIds = mostSoldProducts.map((p) => p.product_id);
    const [products] = await this.getCommonProducts({
      whereInIds: productIds,
    });

    // Ensure the order of products matches the order of most sold
    return productIds.map((id) => products.find((p) => p.id === id)!);
  };

  public static getProductSlugs = async () => {
    const [simplifiedProducts] = await CommonService.getRecords({
      entity: ProductEntity,
      select: ['id', 'name'],
    });

    return simplifiedProducts.map((p) => getSlug(p));
  };

  public static pushImages = async (
    productId: string,
    imageUrls: string[],
  ): Promise<CommonProductModel> => {
    await Promise.all(
      imageUrls.map(async (imageUrl) => {
        await CommonService.createRecord(ProductImageEntity, {
          imageUrl,
          product: {
            id: productId,
          },
        });
      }),
    );

    const updatedProduct = await this.getCommonProduct({
      filter: {
        id: productId,
      },
    });

    return updatedProduct;
  };

  public static removeImage = async (
    productId: string,
    imageUrl: string,
  ): Promise<CommonProductModel> => {
    const productImageRepo = await getRepo(ProductImageEntity);
    await productImageRepo.delete({
      imageUrl,
      product: {
        id: productId,
      },
    });

    const updatedProduct = await this.getCommonProduct({
      filter: {
        id: productId,
      },
    });

    return updatedProduct;
  };

  public static importProduct = async (
    productId: string,
    dto: ImportProductDto,
  ): Promise<ImportOrderModel> => {
    const product = await CommonService.getRecord({
      entity: ProductEntity,
      filter: {
        id: productId,
      },
    });

    const shelfLife = product.shelfLife;

    const importOrder = (await CommonService.createRecord(ImportOrderEntity, {
      supplier: {
        id: dto.supplier,
      },
      product: {
        id: productId,
      },
      importQuantity: dto.importQuantity,
      importDate: dto.importDate,
      manufacturingDate: dto.manufacturingDate,
      expirationDate: addDays(dto.manufacturingDate, shelfLife),
      remainingQuantity: dto.importQuantity,
      unitImportPrice: dto.unitImportPrice,
    })) as ImportOrderModel;

    return importOrder;
  };
}
