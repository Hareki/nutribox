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
  selectAddressDialogOpen: boolean;
  setSelectAddressDialogOpen: (value: boolean) => void;
  addresses: IAccountAddress[];
}

function SelectAddressDialog({
  selectAddressDialogOpen,
  setSelectAddressDialogOpen,
  addresses,
}: SelectAddressDialogProps) {
  const { shadows, palette, transitions } = useTheme();

  return (
    <Dialog
      open={selectAddressDialogOpen}
      onClose={() => setSelectAddressDialogOpen(false)}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>Chọn địa chỉ đã lưu</DialogTitle>
      <DialogContent>
        {addresses.map((address) => (
          <TableRow
            sx={{
              my: 2,
              transition: `all 0.2s ${transitions.easing.easeInOut}`,
              padding: '6px 18px',
              // boxShadow: shadows[3],
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
