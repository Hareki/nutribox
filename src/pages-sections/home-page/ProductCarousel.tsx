import { Box, styled, useTheme } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import { IProduct } from 'api/models/Product.model/types';
import Carousel from 'components/carousel/Carousel';
import CategorySectionCreator from 'components/CategorySectionCreator';
// ProductCard13
import ProductCard from 'components/product-item/ProductCard';
import { Paragraph } from 'components/Typography';
import useWindowSize from 'hooks/useWindowSize';

const SubTitle = styled(Paragraph)(({ theme }) => ({
  fontSize: 12,
  marginTop: '-20px',
  marginBottom: '20px',
  color: theme.palette.grey[600],
}));

// =================================================================
type ProductCarouselProps = {
  title: string;
  subtitle?: string;
  products: IProduct[];
};
// =================================================================

const ProductCarousel: FC<ProductCarouselProps> = ({
  products,
  title,
  subtitle,
}) => {
  const width = useWindowSize();
  const { palette, shadows } = useTheme();
  const [visibleSlides, setVisibleSlides] = useState(3);
  const [dragEnabled, setDragEnabled] = useState(true);

  useEffect(() => {
    if (width === 0) return;
    if (width < 500) setVisibleSlides(1);
    else if (width < 650) setVisibleSlides(2);
    else if (width < 950) setVisibleSlides(3);
    else setVisibleSlides(3);
  }, [width]);

  return (
    <CategorySectionCreator title={title} seeMoreLink='#' mb={0}>
      {subtitle && <SubTitle>{subtitle}</SubTitle>}
      <Carousel
        dragEnabled={dragEnabled}
        infinite
        totalSlides={products.length}
        visibleSlides={visibleSlides}
        sx={{
          '& #backArrowButton, #backForwardButton': {
            width: 40,
            height: 40,
            background: '#fff',
            boxShadow: shadows[2],
            color: palette.primary.main,
          },
        }}
      >
        {products.map((item) => (
          <Box pb={2} key={item.id}>
            <ProductCard
              product={item}
              onPreview={() => setDragEnabled((prev) => !prev)}
            />
          </Box>
        ))}
      </Carousel>
    </CategorySectionCreator>
  );
};

export default ProductCarousel;
