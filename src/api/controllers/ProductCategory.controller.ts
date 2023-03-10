import {
  getAllDocs,
  GetAllDocsOptions,
  getOneDoc,
  GetOneDocsOptions,
} from 'api/base/mongoose/baseHandler';
import ProductCategory from 'api/models/ProductCategory.model';

interface GetAllOptions extends Omit<GetAllDocsOptions, 'model'> {}
interface GetOneOptions extends Omit<GetOneDocsOptions, 'model'> {}

export const getAll = async ({
  populate,
  lean = true,
  ignoreFields = [],
  skip,
  limit,
}: GetAllOptions): Promise<any[]> => {
  ignoreFields = ['__v', ...ignoreFields];
  const categories = await getAllDocs({
    model: ProductCategory,
    populate,
    lean,
    ignoreFields,
    skip,
    limit,
  });
  return categories;
};

export const getOne = async ({ id, populate, lean }: GetOneOptions) => {
  const category = await getOneDoc({
    id,
    model: ProductCategory,
    populate,
    lean,
  });
  return category;
};

const ProductCategoryController = {
  getAll,
  getOne,
};
export default ProductCategoryController;
