import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { FC } from 'react';

import TableRow from 'components/data-table/TableRow';
import { getFullAddress } from 'helpers/address.helper';
import type { CustomerAddressModel } from 'models/customerAddress.model';

interface SelectAddressDialogProps {
  address: CustomerAddressModel;
  onSelectAddress: (address: CustomerAddressModel) => void;
}

const SelectAddressRow: FC<SelectAddressDialogProps> = ({
  address,
  onSelectAddress,
}) => {
  const { palette, transitions } = useTheme();

  const [addressString, setAddressString] = useState<string | undefined>(
    'Đang tải...',
  );

  useEffect(() => {
    if (address) {
      getFullAddress(address).then((address) => {
        setAddressString(address);
      });
    }
  }, [address]);

  return (
    <TableRow
      onClick={() => onSelectAddress(address)}
      className='address-row'
      sx={{
        '&.MuiCard-root': {
          backgroundColor: palette.grey[100],
        },
        my: 2,
        transition: `all 0.2s ${transitions.easing.easeInOut}`,
        padding: '6px 18px',
        ':hover': {
          backgroundColor: palette.primary.light,
          color: palette.primary.dark,
        },
      }}
      key={address.id}
    >
      <Typography whiteSpace='pre' m={0.75} textAlign='left'>
        {address.type}
      </Typography>

      <Typography flex='1 1 260px !important' m={0.75} textAlign='left'>
        {addressString}
      </Typography>
    </TableRow>
  );
};

export default SelectAddressRow;
