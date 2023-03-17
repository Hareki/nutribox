import type { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';

import type { IAccount } from 'api/models/Account.model/types';
import ProfileEditor from 'pages-sections/profile/ProfileEditor';
import ProfileViewer from 'pages-sections/profile/ProfileViewer';
import apiCaller from 'utils/apiCallers/profile';

type ProfileProps = { account: IAccount };
const Profile: NextPage<ProfileProps> = ({ account }) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEditing = () => setIsEditing((prev) => !prev);
  return (
    <>
      {!isEditing ? (
        <ProfileViewer account={account} toggleEditing={toggleEditing} />
      ) : (
        <ProfileEditor account={account} toggleEditing={toggleEditing} />
      )}
    </>
  );
};

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
  const account = await apiCaller.getAccount(session.user.id);
  return { props: { account: account } };
};

export default Profile;
