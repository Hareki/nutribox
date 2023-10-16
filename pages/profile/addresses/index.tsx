import { CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import { useState } from 'react';

import type { IAccountAddress } from 'api/models/Account.model/AccountAddress.schema/types';
import { getCustomerDashboardLayout } from 'components/layouts/customer-dashboard';
import AddressEditor from 'pages-sections/profile/address/AddressEditor';
import AddressViewer from 'pages-sections/profile/address/AddressViewer';
import addressCaller from 'api-callers/profile/addresses';

function Address(): ReactElement {
  const { data: session, status } = useSession();
  const sessionUserId = session?.user?.id;

  const [editingAddress, setEditingAddress] = useState<IAccountAddress>();
  const [isAddMode, setIsAddMode] = useState(false);

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses', sessionUserId],
    queryFn: () => addressCaller.getAddresses(sessionUserId),
  });

  if (status === 'loading') return <CircularProgress />;

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

Address.getLayout = getCustomerDashboardLayout;
export default Address;
