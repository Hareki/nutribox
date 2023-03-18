import { useQuery } from '@tanstack/react-query';
import type { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import { useState } from 'react';

import type { IAccount } from 'api/models/Account.model/types';
import CustomerDashboardLayout from 'components/layouts/customer-dashboard';
import ProfileEditor from 'pages-sections/profile/ProfileEditor';
import ProfileViewer from 'pages-sections/profile/ProfileViewer';
import apiCaller from 'utils/apiCallers/profile';

type ProfileProps = { initialAccount: IAccount };
function Profile({ initialAccount }: ProfileProps): ReactElement {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEditing = () => setIsEditing((prev) => !prev);

  const { data: account } = useQuery({
    queryKey: ['account'],
    queryFn: () => apiCaller.getAccount(account.id),
    onError: (err) => console.log(err),
    initialData: initialAccount,
  });
  return (
    <>
      {!isEditing ? (
        <ProfileViewer account={account} toggleEditing={toggleEditing} />
      ) : (
        <ProfileEditor account={account} toggleEditing={toggleEditing} />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const initialAccount = await apiCaller.getAccount(session.user.id);
  return { props: { initialAccount } };
};

Profile.getLayout = function getLayout(page: ReactElement) {
  return <CustomerDashboardLayout>{page}</CustomerDashboardLayout>;
};
export default Profile;
