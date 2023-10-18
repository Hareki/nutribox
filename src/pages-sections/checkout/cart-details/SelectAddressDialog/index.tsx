import { Dialog, DialogTitle, DialogContent } from '@mui/material';

import SelectAddressRow from './SelectAddressRow';

import type { CustomerAddressModel } from 'models/customerAddress.model';

interface SelectAddressDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  addresses: CustomerAddressModel[];
  onSelectAddress: (address: CustomerAddressModel) => void;
}

function SelectAddressDialog({
  open,
  setOpen,
  addresses,
  onSelectAddress,
}: SelectAddressDialogProps) {
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
          <SelectAddressRow
            key={address.id}
            address={address}
            onSelectAddress={onSelectAddress}
          />
        ))}
      </DialogContent>
    </Dialog>
  );
}

export default SelectAddressDialog;
