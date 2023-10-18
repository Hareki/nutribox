import { Typography, useTheme } from '@mui/material';
import type { FC } from 'react';

import TableRow from 'components/data-table/TableRow';
import { getFullAddress2 } from 'helpers/address.helper';
import type { CustomerAddressModel } from 'models/customerAddress.model';
import { getAddressTypeLabel } from 'utils/string.helper';

interface SelectAddressDialogProps {
  address: CustomerAddressModel;
  onSelectAddress: (address: CustomerAddressModel) => void;
}

const SelectAddressRow: FC<SelectAddressDialogProps> = ({
  address,
  onSelectAddress,
}) => {
  const { palette, transitions } = useTheme();

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
      <Typography
        whiteSpace='pre'
        m={0.75}
        textAlign='left'
        fontWeight={500}
        color={palette.primary[500]}
      >
        {getAddressTypeLabel(address.type)}
      </Typography>

      <Typography flex='1 1 260px !important' m={0.75} textAlign='left'>
        {getFullAddress2(address)}
      </Typography>
    </TableRow>
  );
};

export default SelectAddressRow;
