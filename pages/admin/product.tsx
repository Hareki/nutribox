import type { ReactElement } from 'react';

import AdminDashboardLayout from 'components/layouts/admin-dashboard';

Product.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

export default function Product() {
  return <h2>hello</h2>;
}
