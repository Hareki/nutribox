import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import { memo, type FC } from 'react';

import {
  CustomerCancelOrderDtoSchema,
  type CustomerCancelOrderDto,
} from 'backend/dtos/profile/orders/cancelOrder.dto';
import { Small } from 'components/abstract/Typography';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

type Props = {
  open: boolean;
  handleSubmitForm: (values: CustomerCancelOrderDto) => void;
  isCancellingOrder: boolean;
  onCancel: () => void;
  t: (key: string) => string;
};

const CancelOrderDialog: FC<Props> = ({
  open,
  handleSubmitForm,
  isCancellingOrder,
  onCancel,
  t,
}) => {
  const { values, handleSubmit, handleBlur, handleChange, touched, errors } =
    useFormik<CustomerCancelOrderDto>({
      initialValues: {
        cancellationReason: '',
      },
      validationSchema: toFormikValidationSchema(CustomerCancelOrderDtoSchema),
      onSubmit: handleSubmitForm,
    });

  return (
    <Dialog fullWidth open={open} keepMounted={false}>
      <DialogTitle>Hủy đơn hàng</DialogTitle>
      <DialogContent>
        <div
          style={{
            marginTop: '12px',
          }}
        >
          <form onSubmit={handleSubmit}>
            <Small
              display='block'
              mb={1}
              textAlign='left'
              fontWeight='600'
              color='grey.700'
            >
              Vui lòng nhập lý do hủy đơn:
            </Small>
            <TextField
              fullWidth
              multiline
              rows={3}
              name='cancellationReason'
              size='small'
              type='text'
              variant='outlined'
              onBlur={handleBlur}
              value={values.cancellationReason}
              onChange={handleChange}
              error={
                !!touched.cancellationReason && !!errors.cancellationReason
              }
              helperText={t(
                (touched.cancellationReason &&
                  errors.cancellationReason) as string,
              )}
            />
          </form>
        </div>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          loading={isCancellingOrder}
          onClick={() => handleSubmit()}
          color='error'
        >
          Xác nhận
        </LoadingButton>
        <Button disabled={isCancellingOrder} onClick={onCancel} color='error'>
          Huỷ bỏ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(CancelOrderDialog);
