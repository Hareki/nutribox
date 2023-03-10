import { Types } from 'mongoose';

import { IProduct } from 'api/models/Product.model';

export type ListItem = {
  name: string;
  slug: string;
  products: IProduct[];
};

export interface CategoryNavList {
  listItems: ListItem[];
}
