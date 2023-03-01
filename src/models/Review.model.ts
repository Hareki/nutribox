import Product from './Product.model';
import User from './User.model';

interface Review {
  id: string;
  rating: number;
  customer: User;
  comment: string;
  product: Product;
  published?: boolean;
}

export default Review;
