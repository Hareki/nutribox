import Link from 'next/link';
import { FC } from 'react';

import HoverBox from 'components/HoverBox';
import LazyImage from 'components/LazyImage';
import { H4 } from 'components/Typography';
import { currency } from 'lib';
import Product from 'models/Product.model';

// ==========================================================
type ProductCardProps = Partial<Product>;
// ==========================================================

const ProductCard2: FC<ProductCardProps> = (props) => {
  const { thumbnail, title, price, slug } = props;

  return (
    <Link href={`/product/${slug}`}>
      <a>
        <HoverBox borderRadius='8px' mb={1}>
          <LazyImage
            width={0}
            height={0}
            alt={title}
            src={thumbnail}
            layout='responsive'
          />
        </HoverBox>

        <H4 fontSize={14} mb={0.5}>
          {title}
        </H4>

        <H4 fontSize={14} color='primary.main'>
          {currency(price)}
        </H4>
      </a>
    </Link>
  );
};

export default ProductCard2;
