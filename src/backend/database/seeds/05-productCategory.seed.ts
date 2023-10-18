import type { Connection } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';

import { ProductCategoryEntity } from 'backend/entities/productCategory.entity';
import type { ProductCategoryModel } from 'models/productCategory.model';

type ProductCategorySeed = Omit<
  ProductCategoryModel,
  'createdAt' | 'products' | 'available'
>;

const accountSeeds: ProductCategorySeed[] = [
  {
    id: 'ceef9a0a-8178-497e-8dfd-23c6420da616',
    name: 'Rau củ',
  },
  {
    id: '7dca176c-260b-4d77-9480-2165c56196ea',
    name: 'Thịt tươi sống',
  },
  {
    id: '66f8245d-fdf5-41bc-939c-2e53fc1f9e77',
    name: 'Nước giải khát',
  },
  {
    id: 'c0d30ecb-f9f7-4a9c-8c60-0bfe550bc971',
    name: 'Mì, miến, cháo, phở',
  },
  {
    id: '9c9dda8c-d7a9-4aaf-a84b-8c51da751653',
    name: 'Sữa các loại',
  },
];

export default class createProductCategories implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const productCategoryRepo = connection.getRepository(ProductCategoryEntity);
    const res = productCategoryRepo.create(accountSeeds);
    await productCategoryRepo.save(res);
  }
}
