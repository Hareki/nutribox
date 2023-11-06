import { Box } from '@mui/material';
import type { GetStaticProps } from 'next';
import { useSession } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { ReactElement } from 'react';

import CircularProgressBlock from 'components/common/CircularProgressBlock';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import PasswordChangeForm from 'pages-sections/profile/ProfileEditor/PasswordChangeForm';
import EmployeeProfileForm from 'pages-sections/staff/profile/EmployeeProfileForm';

StaffProfile.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

function StaffProfile() {
  const { data: session } = useSession();
  const account = session?.employeeAccount;

  if (!account) {
    return <CircularProgressBlock />;
  }

  return (
    <Box py={4}>
      <EmployeeProfileForm account={account!} />
      <Box my={3} />
      <PasswordChangeForm isEmployee />
    </Box>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const locales = await serverSideTranslations(locale ?? 'vn', [
    'employee',
    'account',
    'common',
  ]);

  return { props: { ...locales } };
};

export default StaffProfile;
