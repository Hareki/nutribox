import type { ReactElement } from 'react';

import AdminDashboardLayout from 'components/layouts/admin-dashboard';

Order.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

export default function Order() {
  return <h2>hello</h2>;
}
