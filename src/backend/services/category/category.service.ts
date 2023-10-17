import { CommonService } from '../common/common.service';
import type { CommonProductModel } from '../product/helper';
import { CommonProductRelations } from '../product/helper';

import type { CategoryWithProducts } from './helper';

import { ProductEntity } from 'backend/entities/product.entity';
import { ProductCategoryEntity } from 'backend/entities/productCategory.entity';

export class CategoryService {
  public static async getAllCategories() {
    const [data] = await CommonService.getRecords({
      entity: ProductCategoryEntity,
    });

    return data;
  }

  public static async getCategoryWithProducts(
    categoryId: string,
  ): Promise<CategoryWithProducts> {
    const [products] = await CommonService.getRecords({
      entity: ProductEntity,
      relations: CommonProductRelations,
      filter: {
        productCategory: categoryId,
      },
    });

    const category = await CommonService.getRecord({
      entity: ProductCategoryEntity,
      filter: {
        id: categoryId,
      },
    });

    return {
      ...category,
      products: products as CommonProductModel[],
    };
  }
}
