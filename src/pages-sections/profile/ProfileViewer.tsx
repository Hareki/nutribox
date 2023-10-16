import { Person } from '@mui/icons-material';
import type { Theme } from '@mui/material';
import { Skeleton } from '@mui/material';
import { Avatar, Box, Button, Card, Grid, useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import type { FC } from 'react';
import { Fragment } from 'react';

import type { OrderStatusCount } from '../../../pages/api/profile/order-status-count';

import type { IAccount } from 'api/models/Account.model/types';
import SEO from 'components/abstract/SEO';
import { H3, H5, Small } from 'components/abstract/Typography';
import UserDashboardHeader from 'components/common/layout/header/UserDashboardHeader';
import TableRow from 'components/data-table/TableRow';
import { FlexBetween, FlexBox } from 'components/flex-box';
import CustomerDashboardNavigation from 'components/layouts/customer-dashboard/Navigations';
import { getAvatarUrl } from 'helpers/account.helper';
import { translateOrderStatusCountLabel } from 'helpers/order.helper';
import { formatDate } from 'lib';
import profileCaller from 'api-callers/profile';

type ProfileProps = {
  account: IAccount;
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

  const { data: orderStatusCount, isLoading: isLoadingCount } = useQuery({
    queryKey: ['order-status-count', account.id],
    queryFn: () => profileCaller.getOrderStatusCount(account.id),
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
    delivering: 0,
    delivered: 0,
  };

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
                src={getAvatarUrl(account)}
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
                    <H5 my='0px'>{account.fullName}</H5>
                  </div>
                </FlexBetween>
              </Box>
            </Card>
          </Grid>

          <Grid item md={7} xs={12}>
            <Grid container spacing={4} height='100%'>
              {Object.keys(orderStatusCount || dummyOrderStatusCount)
                .filter((key) => key !== 'total')
                .map((key) => (
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
                          {orderStatusCount[key] || 0}
                        </H3>

                        <Small color='grey.600' textAlign='center'>
                          {translateOrderStatusCountLabel(key as any)}
                        </Small>
                      </Card>
                    )}
                  </Grid>
                ))}
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
        <TableRowItem title='Họ và tên lót' value={account.lastName} />
        <TableRowItem title='Tên' value={account.firstName} />
        <TableRowItem title='Email' value={account.email} />
        <TableRowItem title='Số điện thoại' value={account.phone} />
        <TableRowItem title='Ngày sinh' value={formatDate(account.birthday)} />
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
