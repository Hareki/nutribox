import { Box, Card, Divider } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { ReactElement } from 'react';

import staffStoreCaller from 'api-callers/staff/stores';
import { H3, Paragraph } from 'components/abstract/Typography';
import CircularProgressBlock from 'components/common/CircularProgressBlock';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import { STORE_ID } from 'constants/temp.constant';
import ContactInfoForm from 'pages-sections/admin/store-setting/ContactInfoForm';
import StoreHoursForm from 'pages-sections/admin/store-setting/StoreHoursForm';

StoreSetting.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

function StoreSetting() {
  const { data: storeInfoAndWorkTimes, isLoading } = useQuery({
    queryKey: ['stores', STORE_ID],
    queryFn: () => staffStoreCaller.getStoreInfoAndWorkTimes(STORE_ID),
  });

  if (isLoading) return <CircularProgressBlock />;

  return (
    <Box py={4} maxWidth={800} margin='auto'>
      <H3 mb={2}>Cài đặt</H3>

      <Card sx={{ p: 3 }}>
        <Paragraph fontWeight={700} mb={3}>
          Thông tin liên hệ
        </Paragraph>
        <ContactInfoForm initialStoreInfo={storeInfoAndWorkTimes!} />

        <Divider sx={{ my: 4 }} />

        <Paragraph fontWeight={700} mb={2}>
          Giờ làm việc
        </Paragraph>

        <StoreHoursForm initialStoreInfo={storeInfoAndWorkTimes!} />
      </Card>
    </Box>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: STORE_ID } }],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const locales = await serverSideTranslations(locale ?? 'vn', [
    'store',
    'storeWorkTime',
    'customerAddress',
    'customerOrder',
    'common',
  ]);

  return { props: { ...locales } };
};

export default StoreSetting;
