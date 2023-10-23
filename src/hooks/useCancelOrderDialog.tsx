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
import { memo, useCallback, useEffect, useState } from 'react';

import type { CustomerCancelOrderDto } from 'backend/dtos/profile/orders/cancelOrder.dto';
import { CustomerCancelOrderDtoSchema } from 'backend/dtos/profile/orders/cancelOrder.dto';
import { Small } from 'components/abstract/Typography';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

export const useCancelOrderDialog = (
  handleSubmitForm: (values: CustomerCancelOrderDto) => void,
  t: (key: string) => string,
  isCancellingOrder: boolean,
) => {
  const [cancelOrderDialogVisible, setCancelOrderDialogVisible] =
    useState(false);

  const { values, handleSubmit, handleBlur, handleChange, touched, errors } =
    useFormik<CustomerCancelOrderDto>({
      initialValues: {
        cancellationReason: '',
      },
      validationSchema: toFormikValidationSchema(CustomerCancelOrderDtoSchema),
      onSubmit: handleSubmitForm,
    });

  useEffect(() => {
    console.log(
      'file: useCancelOrderDialog.tsx:37 - useEffect - cancelOrderDialogVisible:',
      cancelOrderDialogVisible,
    );
  }, [cancelOrderDialogVisible]);

  const CancelOrderDialog = useCallback(() => {
    return (
      <Dialog fullWidth open={cancelOrderDialogVisible} keepMounted={false}>
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
          <Button
            disabled={isCancellingOrder}
            onClick={() => setCancelOrderDialogVisible(false)}
            color='error'
          >
            Huỷ bỏ
          </Button>
        </DialogActions>
      </Dialog>
    );
  }, [
    cancelOrderDialogVisible,
    errors.cancellationReason,
    handleBlur,
    handleChange,
    handleSubmit,
    isCancellingOrder,
    t,
    touched.cancellationReason,
    values.cancellationReason,
  ]);

  return {
    cancelOrderDialogVisible,
    setCancelOrderDialogVisible,
    CancelOrderDialog: memo(CancelOrderDialog),
  };
};
