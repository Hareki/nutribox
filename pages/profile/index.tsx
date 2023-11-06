import { useQuery } from '@tanstack/react-query';
import type { GetStaticProps } from 'next';
import { useSession } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { ReactElement } from 'react';
import { useState } from 'react';

import profileCaller from 'api-callers/profile';
import SEO from 'components/abstract/SEO';
import CircularProgressBlock from 'components/common/CircularProgressBlock';
import { getCustomerDashboardLayout } from 'components/layouts/customer-dashboard';
import ProfileEditor from 'pages-sections/profile/ProfileEditor';
import ProfileViewer from 'pages-sections/profile/ProfileViewer';

Profile.getLayout = getCustomerDashboardLayout;

function Profile(): ReactElement {
  const { data: session } = useSession();
  const account = session?.account;

  const { data: customerWithDashboardInfo, isLoading: isLoadingCustomer } =
    useQuery({
      queryKey: ['profile', account?.customer.id],
      queryFn: () => profileCaller.getDashboardInfo(),
      onError: (err) => console.log(err),
    });

  const [isEditing, setIsEditing] = useState(false);
  const toggleEditing = () => setIsEditing((prev) => !prev);

  if (!account || isLoadingCustomer) return <CircularProgressBlock />;

  return (
    <>
      <SEO title='Hồ Sơ Của Tôi' />
      {!isEditing ? (
        <ProfileViewer
          customer={customerWithDashboardInfo!}
          toggleEditing={toggleEditing}
        />
      ) : (
        <ProfileEditor account={account!} toggleEditing={toggleEditing} />
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const locales = await serverSideTranslations(locale ?? 'vn', [
    'account',
    'customer',
    'common',
  ]);

  return { props: { ...locales } };
};

export default Profile;
