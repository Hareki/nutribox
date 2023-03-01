import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, Grid, IconButton } from '@mui/material';
import Link from 'next/link';
import { FC, useState } from 'react';

import Carousel from 'components/carousel/Carousel';
import CategorySectionCreator from 'components/CategorySectionCreator';
import ProductCard11 from 'components/product-cards/ProductCard11';
import useSettings from 'hooks/useSettings';

// ==========================================================
type Props = { dealOfTheWeek: any[] };
// ==========================================================

const Section4: FC<Props> = ({ dealOfTheWeek }) => {
  const { settings } = useSettings();
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = dealOfTheWeek.length / 4;
  const firstIndex = currentSlide * 4;
  const lastIndex = firstIndex + 4;

  const handleSlideChange = (count: number) => () => {
    if (count < 0) {
      setCurrentSlide(0);
    } else if (count > totalSlides - 1) {
      setCurrentSlide(totalSlides - 1);
    } else {
      setCurrentSlide(count);
    }
  };

  // custom arrow button for carousel
  const buttonStyled = (color1: string, color2: string) => ({
    boxShadow: 3,
    backgroundColor: color1,
    '&:hover': { backgroundColor: color1, color: color2 },
  });

  return (
    <CategorySectionCreator title='Deal Of The Week'>
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: -55, right: 0 }}>
          {/* CAROUSEL ARROW BUTTONS */}
          <IconButton
            disableRipple
            onClick={handleSlideChange(currentSlide - 1)}
            sx={{ ...buttonStyled('white', 'primary.500'), mr: 1 }}
          >
            {settings.direction === 'ltr' ? (
              <ArrowBack fontSize='small' color='secondary' />
            ) : (
              <ArrowForward fontSize='small' color='secondary' />
            )}
          </IconButton>

          <IconButton
            disableRipple
            onClick={handleSlideChange(currentSlide + 1)}
            sx={{ ...buttonStyled('primary.500', 'white'), color: 'white' }}
          >
            {settings.direction === 'ltr' ? (
              <ArrowForward fontSize='small' color='inherit' />
            ) : (
              <ArrowBack fontSize='small' color='inherit' />
            )}
          </IconButton>
        </Box>
      </Box>

      {/* MAIN CAROUSEL */}
      <Carousel
        showDots
        visibleSlides={1}
        showArrow={false}
        totalSlides={totalSlides}
        currentSlide={currentSlide}
      >
        {[...new Array(totalSlides)].map((_item, ind) => (
          <Box py='0.25rem' key={ind}>
            <Grid container spacing={4}>
              {dealOfTheWeek.slice(firstIndex, lastIndex).map((item, ind) => (
                <Grid item md={6} xs={12} key={ind}>
                  <Link href='/'>

                    <ProductCard11
                      imgUrl={item.imgUrl}
                      title={item.brand}
                      off={item.off}
                    />

                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Carousel>
    </CategorySectionCreator>
  );
};

export default Section4;
