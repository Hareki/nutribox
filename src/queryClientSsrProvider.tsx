import {
  DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { FC, ReactNode } from 'react';

interface QueryClientSsrProviderProps {
  queryClient: QueryClient;
  dehydratedState: DehydratedState;
  children: ReactNode;
}

const QueryClientSsrProvider: FC<QueryClientSsrProviderProps> = ({
  queryClient,
  dehydratedState,
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>{children}</Hydrate>
    </QueryClientProvider>
  );
};

export default QueryClientSsrProvider;
