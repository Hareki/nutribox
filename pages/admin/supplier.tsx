import type { ReactElement } from 'react';

import AdminDashboardLayout from 'components/layouts/admin-dashboard';

Supplier.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

export default function Supplier() {
  return <h2>hello</h2>;
}
