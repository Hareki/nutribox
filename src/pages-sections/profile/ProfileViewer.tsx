import { Person } from '@mui/icons-material';
import type { Theme } from '@mui/material';
import { Skeleton } from '@mui/material';
import { Avatar, Box, Button, Card, Grid, useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import type { FC } from 'react';
import { Fragment } from 'react';

import profileCaller from 'api-callers/profile';
import type { OrderStatusCount } from 'backend/services/customer/helper';
import SEO from 'components/abstract/SEO';
import { H3, H5, Small } from 'components/abstract/Typography';
import UserDashboardHeader from 'components/common/layout/header/UserDashboardHeader';
import TableRow from 'components/data-table/TableRow';
import { FlexBetween, FlexBox } from 'components/flex-box';
import CustomerDashboardNavigation from 'components/layouts/customer-dashboard/Navigations';
import { getAvatarUrl, getFullName } from 'helpers/account.helper';
import { translateOrderStatusCountLabel } from 'helpers/order.helper';
import { formatDate } from 'lib';
import type { CommonCustomerAccountModel } from 'models/account.model';

type ProfileProps = {
  account: CommonCustomerAccountModel;
  toggleEditing?: () => void;
  // orderStatusCount: OrderStatusCount;
  // isLoadingCount: boolean;
};
const ProfileViewer: FC<ProfileProps> = ({
  account,
  toggleEditing,
  // orderStatusCount,
  // isLoadingCount,
}) => {
  const downMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const { data: dashboardInfo, isLoading: isLoadingCount } = useQuery({
    queryKey: ['order-status-count', account.customer.id],
    queryFn: () => profileCaller.getDashboardInfo(),
    onError: (err) => console.log(err),
  });

  // SECTION TITLE HEADER LINK
  const HEADER_LINK = (
    <Button
      color='primary'
      sx={{ px: 4, bgcolor: 'primary.light' }}
      onClick={() => toggleEditing?.()}
    >
      Sửa thông tin
    </Button>
  );

  const dummyOrderStatusCount: OrderStatusCount = {
    total: 0,
    pending: 0,
    processing: 0,
    shipping: 0,
    shipped: 0,
    cancelled: 0,
  };

  const orderStatusCount = dashboardInfo?.orderStatusCount;
  console.log(
    'file: ProfileViewer.tsx:62 - orderStatusCount:',
    orderStatusCount,
    isLoadingCount,
  );
  return (
    <Fragment>
      <SEO title='Hồ Sơ Của Tôi' />

      {/* TITLE HEADER AREA */}
      {!!toggleEditing && (
        <UserDashboardHeader
          icon={Person}
          title='Hồ Sơ Của Tôi'
          button={HEADER_LINK}
          navigation={<CustomerDashboardNavigation />}
        />
      )}

      {/* USER PROFILE INFO */}
      <Box mb={4}>
        <Grid container spacing={3}>
          <Grid item md={5} xs={12}>
            <Card
              sx={{
                display: 'flex',
                p: '14px 32px',
                height: '100%',
                alignItems: 'center',
              }}
            >
              <Avatar
                src={getAvatarUrl(account.customer)}
                sx={{
                  height: 64,
                  width: 64,
                  '& img': {
                    objectFit: 'contain',
                  },
                }}
              />

              <Box ml={1.5} flex='1 1 0'>
                <FlexBetween flexWrap='wrap'>
                  <div>
                    <H5 my='0px'>{getFullName(account.customer)}</H5>
                  </div>
                </FlexBetween>
              </Box>
            </Card>
          </Grid>

          <Grid item md={7} xs={12}>
            <Grid container spacing={4} height='100%'>
              {Object.keys(orderStatusCount || dummyOrderStatusCount)
                .filter((key) => key !== 'total' && key !== 'cancelled')
                .map((key) => {
                  return (
                    <Grid item lg={3} sm={6} xs={6} key={key}>
                      {isLoadingCount ? (
                        <Skeleton
                          variant='rectangular'
                          height='98px'
                          sx={{
                            borderRadius: '8px',
                          }}
                          animation='wave'
                        />
                      ) : (
                        <Card
                          sx={{
                            height: '100%',
                            display: 'flex',
                            p: '1rem 1.25rem',
                            alignItems: 'center',
                            flexDirection: 'column',
                          }}
                        >
                          <H3 color='primary.main' my={0} fontWeight={600}>
                            {orderStatusCount![key] || 0}
                          </H3>

                          <Small color='grey.600' textAlign='center'>
                            {translateOrderStatusCountLabel(
                              key as keyof OrderStatusCount,
                            )}
                          </Small>
                        </Card>
                      )}
                    </Grid>
                  );
                })}
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <TableRow
        sx={{
          cursor: 'auto',
          p: '0.75rem 1.5rem',
          ...(downMd && {
            alignItems: 'start',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }),
        }}
      >
        <TableRowItem title='Họ và tên lót' value={account.customer.lastName} />
        <TableRowItem title='Tên' value={account.customer.firstName} />
        <TableRowItem title='Email' value={account.email} />
        <TableRowItem title='Số điện thoại' value={account.customer.phone} />
        <TableRowItem
          title='Ngày sinh'
          value={formatDate(account.customer.birthday)}
        />
      </TableRow>
    </Fragment>
  );
};

const TableRowItem = ({ title, value }) => {
  return (
    <FlexBox flexDirection='column' flexBasis='auto' p={1}>
      <Small color='grey.600' mb={0.5} textAlign='left'>
        {title}
      </Small>
      <span>{value}</span>
    </FlexBox>
  );
};

export default ProfileViewer;
