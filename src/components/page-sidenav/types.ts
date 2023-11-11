import type { ProductModel } from 'models/product.model';

export type ListItem = {
  name: string;
  slug: string;
  products: ProductModel[];
};

export interface CategoryNavList {
  listItems: ListItem[];
}
