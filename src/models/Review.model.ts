import type Product from './BazaarProduct.model';
import type User from './User.model';

interface Review {
  id: string;
  rating: number;
  customer: User;
  comment: string;
  product: Product;
  published?: boolean;
}

export default Review;
