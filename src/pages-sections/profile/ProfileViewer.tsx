import { Person } from '@mui/icons-material';
import type { Theme } from '@mui/material';
import { Avatar, Box, Button, Card, Grid, useMediaQuery } from '@mui/material';
import type { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import type { FC } from 'react';
import { Fragment } from 'react';

import type { IAccount } from 'api/models/Account.model/types';
import SEO from 'components/abstract/SEO';
import { H3, H5, Small } from 'components/abstract/Typography';
import UserDashboardHeader from 'components/common/layout/header/UserDashboardHeader';
import TableRow from 'components/data-table/TableRow';
import { FlexBetween, FlexBox } from 'components/flex-box';
import CustomerDashboardLayout from 'components/layouts/customer-dashboard';
import CustomerDashboardNavigation from 'components/layouts/customer-dashboard/Navigations';
import { date } from 'lib';
import apiCaller from 'utils/apiCallers/profile';

type ProfileProps = {
  account: IAccount;
  toggleEditing: () => void;
};
const ProfileViewer: FC<ProfileProps> = ({ account, toggleEditing }) => {
  const downMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  // SECTION TITLE HEADER LINK
  const HEADER_LINK = (
    <Button
      color='primary'
      sx={{ px: 4, bgcolor: 'primary.light' }}
      onClick={() => toggleEditing()}
    >
      Sửa thông tin
    </Button>
  );

  const infoList = [
    { title: '16', subtitle: 'Đơn hàng tất cả' },
    { title: '02', subtitle: 'Đang chờ xử lý' },
    { title: '00', subtitle: 'Đang chuẩn bị' },
    { title: '01', subtitle: 'Đang giao hàng' },
  ];

  return (
    <Fragment>
      <SEO title='Hồ Sơ Của Tôi' />
      <CustomerDashboardLayout>
        {/* TITLE HEADER AREA */}
        <UserDashboardHeader
          icon={Person}
          title='Hồ Sơ Của Tôi'
          button={HEADER_LINK}
          navigation={<CustomerDashboardNavigation />}
        />

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
                  src={account.avatarUrl}
                  sx={{ height: 64, width: 64 }}
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
              <Grid container spacing={4}>
                {infoList.map((item) => (
                  <Grid item lg={3} sm={6} xs={6} key={item.subtitle}>
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
                        {item.title}
                      </H3>

                      <Small color='grey.600' textAlign='center'>
                        {item.subtitle}
                      </Small>
                    </Card>
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
          <TableRowItem title='Ngày sinh' value={date(account.birthday)} />
        </TableRow>
      </CustomerDashboardLayout>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  const account = await apiCaller.getAccount(session.user.id);
  console.log(
    'file: index.tsx:156 - const getServerSideProps:GetServerSideProps - account:',
    account,
  );
  return { props: { account: account } };
};

export default ProfileViewer;
