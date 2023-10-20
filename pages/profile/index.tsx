import type { GetStaticProps } from 'next';
import { useSession } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { ReactElement } from 'react';
import { useState } from 'react';

import CircularProgressBlock from 'components/common/CircularProgressBlock';
import { getCustomerDashboardLayout } from 'components/layouts/customer-dashboard';
import ProfileEditor from 'pages-sections/profile/ProfileEditor';
import ProfileViewer from 'pages-sections/profile/ProfileViewer';

Profile.getLayout = getCustomerDashboardLayout;

function Profile(): ReactElement {
  const { data: session } = useSession();
  const account = session?.account;

  const [isEditing, setIsEditing] = useState(false);
  const toggleEditing = () => setIsEditing((prev) => !prev);

  if (!account) return <CircularProgressBlock />;

  return (
    <>
      {!isEditing ? (
        <ProfileViewer
          account={account}
          toggleEditing={toggleEditing}
          // orderStatusCount={orderStatusCount}
          // isLoadingCount={isLoadingCount}
        />
      ) : (
        <ProfileEditor account={account} toggleEditing={toggleEditing} />
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const locales = await serverSideTranslations(locale ?? 'vn', [
    'account',
    'customer',
  ]);

  return { props: { ...locales } };
};

export default Profile;
