import { Avatar, Grid, styled, Theme } from '@mui/material';
import { FC } from 'react';

import BazaarCard from 'components/BazaarCard';
import BazaarRating from 'components/BazaarRating';
import Carousel from 'components/carousel/Carousel';
import { FlexBox } from 'components/flex-box';
import Quote from 'components/icons/Quote';
import { H5, Paragraph } from 'components/Typography';

const cardBorderRadius = '12px';
// styled components
const StyledBazaarCard = styled(BazaarCard)(({ theme }) => ({
  overflow: 'hidden',
  borderRadius: cardBorderRadius,
  position: 'relative',
  padding: '2rem 4rem',
  boxShadow: 'none',
  [theme.breakpoints.down('sm')]: { padding: '2rem' },
}));

const StyledFlexBox = styled(FlexBox)(({ theme }) => ({
  padding: '4rem 6rem',
  [theme.breakpoints.down('sm')]: { padding: '2rem 4rem' },
}));

const StyledQuote = styled(Quote)(({ theme }) => ({
  opacity: 0.08,
  fontSize: '4rem',
  position: 'absolute',
  color: theme.palette.text.primary,
  [theme.breakpoints.down('sm')]: { fontSize: '3rem' },
}));

const StyledAvatar = styled(Avatar)({
  width: 64,
  height: 64,
  margin: 'auto',
  display: 'block',
});

const StyledGridContainer = styled(Grid)(({ theme }) => ({
  flexWrap: 'wrap',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    gap: 16,
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
}));

// ======================================================================
type Props = { testimonials: any[] };
// ======================================================================

const TestimonialsSection: FC<Props> = ({ testimonials = [] }) => {
  return (
    <Carousel
      spacing='0px'
      showDots
      totalSlides={3}
      visibleSlides={1}
      showArrowOnHover
      arrowButtonColor='inherit'
      sx={{
        '.carousel__slider--horizontal': (theme: Theme) => {
          return {
            borderRadius: cardBorderRadius,
            boxShadow: theme.shadows[2],
          };
        },
      }}
    >
      {testimonials.map((data, index) => (
        <StyledBazaarCard key={index}>
          <StyledFlexBox position='relative' flexWrap='wrap'>
            <StyledQuote sx={{ left: 0, top: 0 }} />

            <StyledGridContainer container spacing={1}>
              <Grid item lg={2} md={3}>
                <StyledAvatar src={data.user.avatar} />
              </Grid>

              <Grid item lg={10} md={9}>
                <H5 mt={1} fontWeight='700'>
                  {data.user.name}
                </H5>
                <BazaarRating
                  value={data.rating || 0}
                  color='warn'
                  readOnly
                  precision={0.5}
                />
                <Paragraph color='grey.700'>{data.comment}</Paragraph>
              </Grid>
            </StyledGridContainer>

            <StyledQuote
              sx={{ right: 0, bottom: 0, transform: 'rotate(180deg)' }}
            />
          </StyledFlexBox>
        </StyledBazaarCard>
      ))}
    </Carousel>
  );
};

export default TestimonialsSection;
