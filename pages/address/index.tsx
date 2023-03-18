import { useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import { useState } from 'react';

import type { IAccountAddress } from 'api/models/Account.model/AccountAddress.schema/types';
import CustomerDashboardLayout from 'components/layouts/customer-dashboard';
import AddressEditor from 'pages-sections/address/AddressEditor';
import AddressViewer from 'pages-sections/address/AddressViewer';
import apiCaller from 'utils/apiCallers/address';

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
  const session = await getSession({ req: context.req });
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

Address.getLayout = function getLayout(page: ReactElement) {
  return <CustomerDashboardLayout>{page}</CustomerDashboardLayout>;
};
export default Address;
