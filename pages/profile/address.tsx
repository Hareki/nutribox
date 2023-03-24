import { useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { authOptions } from '../api/auth/[...nextauth]';

import type { IAccountAddress } from 'api/models/Account.model/AccountAddress.schema/types';
import { getCustomerDashboardLayout } from 'components/layouts/customer-dashboard';
import AddressEditor from 'pages-sections/profile/address/AddressEditor';
import AddressViewer from 'pages-sections/profile/address/AddressViewer';
import apiCaller from 'utils/apiCallers/profile/address';

interface AddressProps {
  sessionUserId: string;
}

function Address({ sessionUserId }: AddressProps): ReactElement {
  const [editingAddress, setEditingAddress] = useState<IAccountAddress>();
  const [isAddMode, setIsAddMode] = useState(false);

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses', sessionUserId],
    queryFn: () => apiCaller.getAddresses(sessionUserId),
  });

  return (
    <>
      {isAddMode || editingAddress ? (
        <AddressEditor
          accountId={sessionUserId}
          setIsAddMode={setIsAddMode}
          setEditingAddress={setEditingAddress}
          isAddMode={isAddMode}
          editingAddress={editingAddress}
        />
      ) : (
        <AddressViewer
          isLoading={isLoading}
          accountId={sessionUserId}
          setIsAddMode={setIsAddMode}
          setEditingAddress={setEditingAddress}
          addresses={addresses}
        />
      )}

      <ReactQueryDevtools />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return { props: { sessionUserId: session.user.id } };
};
Address.getLayout = getCustomerDashboardLayout;
export default Address;
