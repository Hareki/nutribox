import type { ReactElement } from 'react';

import AdminDashboardLayout from 'components/layouts/admin-dashboard';

Account.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

export default function Account() {
  return <h2>hello</h2>;
}
