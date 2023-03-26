import { Box, Card, Divider } from '@mui/material';
import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import type { ReactElement } from 'react';

import { authOptions } from '../api/auth/[...nextauth]';

import { getStore } from 'api/base/server-side-getters';
import { serialize } from 'api/helpers/object.helper';
import type { IStore } from 'api/models/Store.model/types';
import { Paragraph } from 'components/abstract/Typography';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import ContactInfoForm from 'pages-sections/admin/store-setting/ContactInfoForm';
import StoreHoursForm from 'pages-sections/admin/store-setting/StoreHoursForm';
import { StoreId } from 'utils/constants';

StoreSetting.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

interface StoreSettingProps {
  initialStoreInfo: IStore;
}

function StoreSetting({ initialStoreInfo }: StoreSettingProps) {
  return (
    <Box py={4} maxWidth={740} margin='auto'>
      <Card sx={{ p: 3 }}>
        <Paragraph fontWeight={700} mb={2}>
          Thông tin liên hệ
        </Paragraph>
        <ContactInfoForm initialStoreInfo={initialStoreInfo} />

        <Divider sx={{ my: 4 }} />

        <Paragraph fontWeight={700} mb={2}>
          Giờ làm việc
        </Paragraph>

        <StoreHoursForm initialStoreInfo={initialStoreInfo} />
      </Card>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const initialStoreInfo = await getStore(StoreId);
  return { props: { initialStoreInfo: serialize(initialStoreInfo) } };
};

export default StoreSetting;
