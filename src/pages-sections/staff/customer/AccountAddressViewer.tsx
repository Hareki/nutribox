import { Box, Card, Table, TableBody, TableContainer } from '@mui/material';
import { Fragment } from 'react';

import AddressRow from './AddressRow';

import TableHeader from 'components/data-table/TableHeader';
import Scrollbar from 'components/Scrollbar';
import { getFullAddressFromNames } from 'helpers/address.helper';
import useMuiTable from 'hooks/useMuiTable';
import type { CustomerAddressModel } from 'models/customerAddress.model';

const tableHeading = [
  { id: 'title', label: 'Tên', align: 'left' },
  { id: 'fullAddress', label: 'Địa chỉ', align: 'left' },
  { id: 'isDefault', label: 'Mặc định', align: 'center' },
];

const mapAddressRow = (address: CustomerAddressModel) => ({
  fullAddress: getFullAddressFromNames(address),
  isDefault: address.isDefault,
  title: address.title,
});

export type FilteredAddress = ReturnType<typeof mapAddressRow>;

interface AccountAddressViewerProps {
  addresses: CustomerAddressModel[];
}
const AccountAddressViewer = ({ addresses }: AccountAddressViewerProps) => {
  const filterAddress = addresses.map(mapAddressRow);

  const { order, selected, filteredList } = useMuiTable({
    listData: filterAddress || [],
  });
  return (
    <Fragment>
      <Box sx={{ mt: 4 }}>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 900 }}>
              <Table>
                <TableHeader
                  order={order}
                  hideSelectBtn
                  heading={tableHeading}
                  numSelected={selected.length}
                  rowCount={filteredList.length}
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
      </Box>
    </Fragment>
  );
};

export default AccountAddressViewer;
