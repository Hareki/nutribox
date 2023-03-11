import { IProduct } from 'api/models/Product.model/types';

export type ListItem = {
  name: string;
  slug: string;
  products: IProduct[];
};

export interface CategoryNavList {
  listItems: ListItem[];
}
