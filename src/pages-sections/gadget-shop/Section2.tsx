import { Container, Grid } from '@mui/material';
import { FC } from 'react';

import HomeFourCard2 from './homeFour-cards/HomeFourCard2';

import CategorySectionHeader from 'components/CategorySectionHeader';
import Category from 'models/Category.model';

// =====================================================
type Props = { featuredCategories: Category[] };
// =====================================================

const Section2: FC<Props> = ({ featuredCategories }) => {
  const firstItem = featuredCategories[0];
  const featured = featuredCategories.slice(1, featuredCategories.length);
  return (
    <Container sx={{ mb: '4rem' }}>
      <CategorySectionHeader title='Featured Categories' />
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <HomeFourCard2
            title={firstItem.name}
            imgUrl={firstItem.image}
            headingStyle={{ pl: '1.5rem', pb: '1rem', pt: '1.5rem' }}
          />
        </Grid>

        <Grid container item md={6} xs={12} spacing={3}>
          {featured.map((category, ind) => (
            <Grid item xs={6} key={ind}>
              <HomeFourCard2 title={category.name} imgUrl={category.image} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Section2;
