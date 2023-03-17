import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import type { FC, ReactNode } from 'react';

export interface InfoDialogProps {
  open: boolean;
  variant: 'info' | 'error';
  title: string;
  content: ReactNode | string;
  handleClose: () => void;
}

const InfoDialog: FC<InfoDialogProps> = ({
  open,
  variant,
  handleClose,
  title,
  content,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        <Button onClick={handleClose} color={variant}>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoDialog;
