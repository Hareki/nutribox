import { Person } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import type { NextPage } from 'next';

import PasswordChangeForm from './PasswordChangeForm';
import ProfileForm from './ProfileForm';

import UserDashboardHeader from 'components/common/layout/header/UserDashboardHeader';
import CustomerDashboardNavigation from 'components/layouts/customer-dashboard/Navigations';
import type { CommonCustomerAccountModel } from 'models/account.model';

type Props = {
  account: CommonCustomerAccountModel;
  toggleEditing: () => void;
};

const ProfileEditor: NextPage<Props> = ({ account, toggleEditing }) => {
  const HEADER_LINK = (
    <Button
      color='primary'
      sx={{ px: 4, bgcolor: 'primary.light' }}
      onClick={() => toggleEditing()}
    >
      Huỷ bỏ
    </Button>
  );

  return (
    <>
      <UserDashboardHeader
        icon={Person}
        title='Cập nhật tài khoản'
        button={HEADER_LINK}
        navigation={<CustomerDashboardNavigation />}
      />

      <ProfileForm account={account} toggleEditing={toggleEditing} />
      <Box my={3} />
      <PasswordChangeForm />
    </>
  );
};

export default ProfileEditor;
