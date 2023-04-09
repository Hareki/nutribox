import {
  Box,
  Card,
  Skeleton,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Fragment } from 'react';

import AddressRow from './AddressRow';

import type { IAccountAddress } from 'api/models/Account.model/AccountAddress.schema/types';
import TableHeader from 'components/data-table/TableHeader';
import Scrollbar from 'components/Scrollbar';
import { getFullAddress } from 'helpers/address.helper';
import useMuiTable from 'hooks/useMuiTable';
import apiCaller from 'utils/apiCallers/profile/address';

const tableHeading = [
  { id: 'title', label: 'Tên', align: 'left' },
  { id: 'fullAddress', label: 'Địa chỉ', align: 'left' },
  { id: 'isDefault', label: 'Mặc định', align: 'center' },
];

const mapAddressRow = (address: IAccountAddress) => ({
  fullAddress: getFullAddress(address),
  isDefault: address.isDefault,
  title: address.title,
});

export type FilteredAddress = ReturnType<typeof mapAddressRow>;

interface AccountAddressViewerProps {
  accountId: string;
}
const AccountAddressViewer = ({ accountId }: AccountAddressViewerProps) => {
  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses', accountId],
    queryFn: () => apiCaller.getAddresses(accountId),
  });

  const filterAddress = addresses?.map(mapAddressRow);

  const {
    order,
    // orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    // handleRequestSort,
  } = useMuiTable({
    listData: filterAddress || [],
    // defaultSort: 'id',
    // defaultOrder: 'desc',
  });
  return (
    <Fragment>
      <Box sx={{ mt: 4 }}>
        {isLoading ? (
          <Skeleton
            variant='rectangular'
            animation='wave'
            width='100%'
            height='500px'
            sx={{ borderRadius: '8px' }}
          />
        ) : (
          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 900 }}>
                <Table>
                  <TableHeader
                    order={order}
                    hideSelectBtn
                    // orderBy={orderBy}
                    heading={tableHeading}
                    numSelected={selected.length}
                    rowCount={filteredList.length}
                    // onRequestSort={handleRequestSort}
                  />

                  <TableBody>
                    {filteredList.map((address, index) => (
                      <AddressRow address={address} key={index} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </Card>
        )}
      </Box>
    </Fragment>
  );
};

export default AccountAddressViewer;
