import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';

import VendorDashboardLayout from 'components/layouts/vendor-dashboard';
import { H3 } from 'components/Typography';
import Order from 'models/Order.model';
import { OrderDetails } from 'pages-sections/admin';
import api from 'utils/__api__/dashboard';

// =============================================================================
OrderEdit.getLayout = function getLayout(page: ReactElement) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================

export default function OrderEdit() {
  const { query } = useRouter();
  const [orderDetails, setOrderDetails] = useState<Order>(null);

  useEffect(() => {
    api.getOrder(query.id as string).then((data) => setOrderDetails(data));
  }, [query.id]);

  if (!orderDetails) {
    return <h1>Loading...</h1>;
  }

  return (
    <Box py={4}>
      <H3 mb={2}>Order Details</H3>
      <OrderDetails order={orderDetails} />
    </Box>
  );
}
