import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ICdsUpeProduct, IProduct } from 'api/models/Product.model/types';
import type { ISupplierDropdown } from 'api/models/Supplier.model/types';
import { addDays } from 'date-fns';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';

import type { ImportProductRb } from '../../../../../pages/api/admin/product/import-product';

import apiCaller from 'api-callers/staff/products';
import { Paragraph, Span } from 'components/abstract/Typography';
import CustomTextField from 'components/common/input/CustomTextField';
import CustomPickersDay from 'components/CustomPickersDay';
import { formatCurrency } from 'lib';

interface ExpirationOrderModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  product: ICdsUpeProduct;
}

interface FormValues {
  importDate: Date;
  supplier: ISupplierDropdown;
  quantity: number;
}

const ExpirationOrderModal = ({
  open,
  setOpen,
  product,
}: ExpirationOrderModalProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const { enqueueSnackbar } = useSnackbar();

  const getInitialValues = (): FormValues => ({
    importDate: new Date(),
    supplier: product?.defaultSupplier
      ? {
          id: product.defaultSupplier.id,
          name: product.defaultSupplier.name,
        }
      : null,
    quantity: 1,
  });

  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['supplier', 'dropdown'],
    queryFn: () => apiCaller.getSupplierDropdown(),
  });

  const queryClient = useQueryClient();
  const { mutate: importProduct, isLoading: isMutating } = useMutation<
    IProduct,
    unknown,
    ImportProductRb
  >({
    mutationFn: (requestBody) => apiCaller.importProduct(requestBody),
    onSuccess: () => {
      enqueueSnackbar('Nhập hàng thành công', { variant: 'success' });
      queryClient.refetchQueries(['admin/order-expiration', product.id]);
      setOpen(false);
    },
    onError: (err) => {
      console.log(err);
      enqueueSnackbar('Đã có lỗi xảy ra, vui lòng thử lại sau', {
        variant: 'error',
      });
    },
  });

  const handleFormSubmit = (values: FormValues) => {
    const requestBody: ImportProductRb = {
      productId: product.id,
      supplierId: values.supplier.id,
      quantity: values.quantity,
      importDate: values.importDate.toISOString(),
      unitWholesalePrice: product.wholesalePrice,
    };
    console.log(
      'file: ExpirationOrderModal.tsx:90 - handleFormSubmit - requestBody:',
      requestBody,
    );

    importProduct(requestBody);
  };

  const {
    values,
    setFieldValue,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik<FormValues>({
    initialValues: getInitialValues(),
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <Dialog
      scroll='body'
      open={open}
      maxWidth='sm'
      // fullWidth={isMobile}
      fullWidth
      onClose={() => setOpen(false)}
      sx={{
        zIndex: 9999,
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle id='alert-dialog-title'>Nhập sản phẩm</DialogTitle>
        <DialogContent>
          {/* <form onSubmit={handleSubmit}> */}
          <Stack gap={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                PopperProps={{
                  sx: {
                    zIndex: 99999,
                  },
                }}
                label='Ngày nhập'
                disableFuture
                minDate={addDays(new Date(), -3)}
                value={values.importDate}
                inputFormat='dd/MM/yyyy'
                renderInput={(props) => (
                  <CustomTextField
                    mb={1.5}
                    fullWidth
                    name='importDate'
                    size='small'
                    helperText={
                      (touched.importDate && errors.importDate) as string
                    }
                    error={!!touched.importDate && !!errors.importDate}
                    {...(props as any)}
                  />
                )}
                onChange={(newValue) => {
                  setFieldValue('importDate', newValue);
                }}
                renderDay={(_, __, pickersDayProps) => (
                  <CustomPickersDay
                    {...pickersDayProps}
                    selected_color='white'
                  />
                )}
              />
            </LocalizationProvider>

            <Autocomplete
              fullWidth
              size='medium'
              sx={{
                mb: 2,
              }}
              options={suppliers || []}
              disabled={isLoading}
              value={values.supplier}
              getOptionLabel={(value) => (value as ISupplierDropdown).name}
              onChange={(_, value) => {
                setFieldValue('supplier', value);
              }}
              renderInput={(params) => (
                <CustomTextField
                  label='Nhà cung cấp'
                  placeholder='Chọn nhà cung cấp'
                  error={!!touched.supplier && !!errors.supplier}
                  helperText={(touched.supplier && errors.supplier) as string}
                  {...params}
                />
              )}
            />

            <CustomTextField
              mb={1.5}
              fullWidth
              name='quantity'
              size='small'
              variant='outlined'
              type='number'
              onBlur={handleBlur}
              value={values.quantity}
              onChange={handleChange}
              label='Số lượng'
              placeholder='Nhập số lượng'
              error={!!touched.quantity && !!errors.quantity}
              helperText={(touched.quantity && errors.quantity) as string}
              // InputProps={{
              //   // readOnly: !isEditing,
              //   inputComponent: CurrencyInput as any,
              // }}
            />

            <Paragraph ml='auto'>
              <Span fontWeight={500}>Tổng tiền: </Span>{' '}
              {formatCurrency(
                (product?.wholesalePrice || 0) * (values.quantity || 1),
              )}
            </Paragraph>
          </Stack>
          {/* </form> */}
        </DialogContent>
        <DialogActions>
          <LoadingButton loading={isMutating} color='primary' type='submit'>
            Xác nhận
          </LoadingButton>
          <Button onClick={() => setOpen(false)} color='primary'>
            Huỷ bỏ
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const validationSchema = yup.object().shape({
  importDate: yup.date().required('Vui lòng chọn ngày nhập'),
  supplier: yup
    .object()
    .typeError('Vui lòng chọn nhà cung cấp')
    .required('Vui lòng chọn nhà cung cấp'),
  quantity: yup
    .number()
    .required('Vui lòng nhập số lượng')
    .min(1, 'Số lượng phải lớn hơn 0')
    .max(999, 'Số lượng tối đa là 999'),
});

export default ExpirationOrderModal;
