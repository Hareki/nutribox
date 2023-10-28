import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';

import staffCustomerCaller from 'api-callers/staff/customers';
import CircularProgressBlock from 'components/common/CircularProgressBlock';
import AdminDetailsViewHeader from 'components/common/layout/header/AdminDetailsViewHeader';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import { CUSTOMERS_STAFF_ROUTE } from 'constants/routes.ui.constant';
import ProfileViewer from 'pages-sections/profile/ProfileViewer';
import AccountAddressViewer from 'pages-sections/staff/customer/AccountAddressViewer';

AdminAccountDetails.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

function AdminAccountDetails() {
  const router = useRouter();
  const customerId = router.query.id as string;
  const { data: customer, isLoading } = useQuery({
    queryKey: ['staff', 'customers', customerId],
    queryFn: () => staffCustomerCaller.getCustomer(customerId),
  });

  return (
    <Box py={4} maxWidth={1200} margin='auto'>
      <AdminDetailsViewHeader
        label='Chi tiết tài khoản'
        hrefBack={CUSTOMERS_STAFF_ROUTE}
      />
      {isLoading ? (
        <CircularProgressBlock />
      ) : (
        <>
          <ProfileViewer customer={customer!} />
          <AccountAddressViewer addresses={customer!.customerAddresses} />
        </>
      )}
    </Box>
  );
}

export default AdminAccountDetails;
