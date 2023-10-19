import { CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import { useState } from 'react';

import addressCaller from 'api-callers/profile/addresses';
import CircularProgressBlock from 'components/common/CiruclarProgressBlock';
import { getCustomerDashboardLayout } from 'components/layouts/customer-dashboard';
import type { CustomerAddressModel } from 'models/customerAddress.model';
import AddressEditor from 'pages-sections/profile/address/AddressEditor';
import AddressViewer from 'pages-sections/profile/address/AddressViewer';

function Address(): ReactElement {
  const { data: session } = useSession();
  const sessionUserId = session?.account.customer.id;

  const [editingAddress, setEditingAddress] = useState<CustomerAddressModel>();
  const [isAddMode, setIsAddMode] = useState(false);

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses', sessionUserId],
    queryFn: () => addressCaller.getAddresses(),
  });

  if (!sessionUserId || !addresses) return <CircularProgressBlock />;

  return (
    <>
      {isAddMode || editingAddress ? (
        <AddressEditor
          accountId={sessionUserId!}
          setIsAddMode={setIsAddMode}
          setEditingAddress={setEditingAddress}
          isAddMode={isAddMode}
          editingAddress={editingAddress!}
        />
      ) : (
        <AddressViewer
          isLoading={isLoading}
          accountId={sessionUserId!}
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
