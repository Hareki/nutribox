import { useQuery } from '@tanstack/react-query';
import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { getAccount } from 'api/base/server-side-getters';
import { serialize } from 'api/helpers/object.helper';
import type { IAccount } from 'api/models/Account.model/types';
import { getCustomerDashboardLayout } from 'components/layouts/customer-dashboard';
import { checkContextCredentials } from 'helpers/session.helper';
import ProfileEditor from 'pages-sections/profile/ProfileEditor';
import ProfileViewer from 'pages-sections/profile/ProfileViewer';
import apiCaller from 'utils/apiCallers/profile';

Profile.getLayout = getCustomerDashboardLayout;

type ProfileProps = { initialAccount: IAccount };
function Profile({ initialAccount }: ProfileProps): ReactElement {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEditing = () => setIsEditing((prev) => !prev);

  const { data: account } = useQuery({
    queryKey: ['account'],
    queryFn: () => apiCaller.getAccount(account.id),
    // FIXME onError bị lặp giữa các useMutation
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
  const { isNotAuthorized, blockingResult, session } =
    await checkContextCredentials(context);
  if (isNotAuthorized) return blockingResult;

  const initialAccount = await getAccount(session.user.id);
  return { props: { initialAccount: serialize(initialAccount) } };
};

export default Profile;
