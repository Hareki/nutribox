// TODO: Đây là page để hiển thị các chi nhánh của store
import { Container, Grid, Pagination } from '@mui/material';
import { GetStaticProps, NextPage } from 'next';

import { FlexBetween } from 'components/flex-box';
import ShopLayout2 from 'components/layouts/ShopLayout2';
import ShopCard1 from 'components/shop/ShopCard1';
import { H2, Span } from 'components/Typography';
import Shop from 'models/Shop.model';
import api from 'utils/__api__/shop';

// =============================================
type ShopListProps = { shopList: Shop[] };
// =============================================

const ShopList: NextPage<ShopListProps> = ({ shopList }) => {
  return (
    <ShopLayout2>
      <Container sx={{ mt: 4, mb: 6 }}>
        <H2 mb={3}>All Shops</H2>

        {/* ALL SHOP LIST AREA */}
        <Grid container spacing={3}>
          {shopList.map((item) => (
            <Grid item lg={4} sm={6} xs={12} key={item.id}>
              <ShopCard1
                name={item.name}
                slug={item.slug}
                phone={item.phone}
                address={item.address}
                rating={item.rating || 5}
                coverPicture={item.coverPicture}
                profilePicture={item.profilePicture}
              />
            </Grid>
          ))}
        </Grid>

        {/* PAGINATION AREA */}
        <FlexBetween flexWrap='wrap' mt={4}>
          <Span color='grey.600'>Showing 1-9 of 300 Shops</Span>
          <Pagination
            count={shopList.length}
            variant='outlined'
            color='primary'
          />
        </FlexBetween>
      </Container>
    </ShopLayout2>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const shopList = await api.getShopList();
  return { props: { shopList } };
};

export default ShopList;
