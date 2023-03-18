import { useQuery } from '@tanstack/react-query';
import type { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';

import type { IAccountAddress } from 'api/models/Account.model/AccountAddress.schema/types';
import AddressEditor from 'pages-sections/address/AddressEditor';
import AddressViewer from 'pages-sections/address/AddressViewer';
import apiCaller from 'utils/apiCallers/address';

interface AddressProps {
  sessionUserId: string;
}
const Address: NextPage<AddressProps> = ({ sessionUserId }) => {
  const [editingAddress, setEditingAddress] = useState<IAccountAddress>();
  const [isAddMode, setIsAddMode] = useState(false);

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses', sessionUserId],
    queryFn: () => apiCaller.getAddresses(sessionUserId),
    initialData: [],
  });

  return (
    <>
      {isAddMode || editingAddress ? (
        <AddressEditor
          accountId={sessionUserId}
          setIsAddMode={setIsAddMode}
          setEditingAddress={setEditingAddress}
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

  return { props: { sessionUserId: session.user.id } };
};

export default Address;
