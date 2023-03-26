import { Box, Card, Divider } from '@mui/material';
import type { ReactElement } from 'react';

import { Paragraph } from 'components/abstract/Typography';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import ContactInfoForm from 'pages-sections/admin/shop-setting/ContactInfoForm';
import StoreHoursForm from 'pages-sections/admin/shop-setting/StoreHoursForm';

StoreSetting.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

function StoreSetting() {
  return (
    <Box py={4} maxWidth={740} margin='auto'>
      <Card sx={{ p: 3 }}>
        <Paragraph fontWeight={700} mb={2}>
          Thông tin liên hệ
        </Paragraph>
        <ContactInfoForm />

        <Divider sx={{ my: 4 }} />

        <Paragraph fontWeight={700} mb={2}>
          Giờ làm việc
        </Paragraph>

        <StoreHoursForm />
      </Card>
    </Box>
  );
}

export default StoreSetting;
