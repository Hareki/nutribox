import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import type { FC, ReactNode } from 'react';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  content: ReactNode | string;
  handleConfirm: () => void;
  handleCancel: () => void;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  open,
  handleConfirm,
  handleCancel,
  title,
  content,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        {typeof content === 'string' ? (
          <DialogContentText id='alert-dialog-description'>
            {content}
          </DialogContentText>
        ) : (
          content
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} color='info'>
          Xác nhận
        </Button>
        <Button onClick={handleCancel} color='info'>
          Huỷ bỏ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
