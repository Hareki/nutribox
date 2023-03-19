import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  useTheme,
} from '@mui/material';

import type { IAccountAddress } from 'api/models/Account.model/AccountAddress.schema/types';
import TableRow from 'components/data-table/TableRow';
import { getFullAddress } from 'helpers/address.helper';

interface SelectAddressDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  addresses: IAccountAddress[];
  onSelectAddress: (address: IAccountAddress) => void;
}

function SelectAddressDialog({
  open,
  setOpen,
  addresses,
  onSelectAddress,
}: SelectAddressDialogProps) {
  const { palette, transitions } = useTheme();

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>Chọn địa chỉ đã lưu</DialogTitle>
      <DialogContent>
        {addresses.map((address) => (
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
              {address.title}
            </Typography>

            <Typography flex='1 1 260px !important' m={0.75} textAlign='left'>
              {getFullAddress(address)}
            </Typography>
          </TableRow>
        ))}
      </DialogContent>
    </Dialog>
  );
}

export default SelectAddressDialog;
