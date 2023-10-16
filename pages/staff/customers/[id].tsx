import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import AccountController from 'api/controllers/Account.controller';
import { checkContextCredentials } from 'api/helpers/auth.helper';
import { serialize } from 'api/helpers/object.helper';
import type { IAccount } from 'api/models/Account.model/types';
import { Types } from 'mongoose';
import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';

import apiCaller from 'api-callers/admin/account';
import AdminDetailsViewHeader from 'components/common/layout/header/AdminDetailsViewHeader';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import AccountAddressViewer from 'pages-sections/admin/account/AccountAddressViewer';
import ProfileViewer from 'pages-sections/profile/ProfileViewer';

AdminAccountDetails.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

type Props = {
  initialAccount: IAccount;
};

function AdminAccountDetails({ initialAccount }: Props) {
  const { data: account } = useQuery({
    queryKey: ['order', initialAccount.id],
    queryFn: () => apiCaller.getAccount(initialAccount.id),
    initialData: initialAccount,
  });

  return (
    <Box py={4} maxWidth={1200} margin='auto'>
      <AdminDetailsViewHeader
        label='Chi tiết tài khoản'
        hrefBack='/admin/account'
      />
      <ProfileViewer account={account} />
      <AccountAddressViewer accountId={account.id} />
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { isNotAuthorized, blockingResult } =
    await checkContextCredentials(context);
  if (isNotAuthorized) return blockingResult;

  const isValidId = Types.ObjectId.isValid(context.params.id as string);
  if (!isValidId) {
    return {
      notFound: true,
    };
  }

  const account = await AccountController.getOne({
    id: context.params.id as string,
  });

  if (!account) {
    return {
      notFound: true,
    };
  }

  return {
    props: { initialAccount: serialize(account) },
  };
};

export default AdminAccountDetails;
