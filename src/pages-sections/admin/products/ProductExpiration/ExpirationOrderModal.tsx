import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addDays } from 'date-fns';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';

import apiCaller from 'api-callers/staff/products';
import {
  ImportProductFormSchema,
  type ImportProductDto,
  type ImportProductFormValues,
} from 'backend/dtos/product/importProduct.dto';
import type { ExtendedCommonProductModel } from 'backend/services/product/helper';
import type { SupplierDropDown } from 'backend/services/supplier/helper';
import { Paragraph, Span } from 'components/abstract/Typography';
import CurrencyInput from 'components/common/input/CurrencyInput';
import CustomTextField from 'components/common/input/CustomTextField';
import CustomPickersDay from 'components/CustomPickersDay';
import type { AxiosErrorWithMessages } from 'helpers/error.helper';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import { useServerSideErrorDialog } from 'hooks/useServerErrorDialog';
import { formatCurrency } from 'lib';
import type { ProductModel } from 'models/product.model';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

interface ExpirationOrderModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  product: ExtendedCommonProductModel;
}

const ExpirationOrderModal = ({
  open,
  setOpen,
  product,
}: ExpirationOrderModalProps) => {
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useCustomTranslation(['product', 'importOrder']);
  const { ErrorDialog, dispatchErrorDialog } = useServerSideErrorDialog({
    t,
    operationName: 'Nhập hàng',
  });

  const getInitialValues = (): ImportProductFormValues => {
    return {
      importDate: new Date(),
      supplier: product?.defaultSupplier
        ? {
            id: product.defaultSupplier.id,
            name: product.defaultSupplier.name,
          }
        : (null as any),
      importQuantity: 1,
      manufacturingDate: new Date(),
      unitImportPrice: product?.defaultImportPrice || 0,
    };
  };

  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['supplier', 'dropdown'],
    queryFn: () => apiCaller.getSupplierDropdown(),
  });

  const queryClient = useQueryClient();
  const { mutate: importProduct, isLoading: isMutating } = useMutation<
    ProductModel,
    AxiosErrorWithMessages,
    ImportProductDto
  >({
    mutationFn: (requestBody) =>
      apiCaller.importProduct(product.id, requestBody),
    onSuccess: () => {
      enqueueSnackbar('Nhập hàng thành công', { variant: 'success' });
      queryClient.refetchQueries(['staff', 'import-orders', product.id]);
      setOpen(false);
    },
    onError: dispatchErrorDialog,
  });

  const handleFormSubmit = (values: ImportProductFormValues) => {
    const requestBody: ImportProductDto = {
      ...values,
      supplier: values.supplier.id,
    };

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
  } = useFormik<ImportProductFormValues>({
    initialValues: getInitialValues(),
    validationSchema: toFormikValidationSchema(ImportProductFormSchema),
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
        zIndex: 999,
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
                    {...(props as any)}
                    mb={1.5}
                    fullWidth
                    name='importDate'
                    size='small'
                    helperText={t(
                      (touched.importDate && errors.importDate) as string,
                    )}
                    onBlur={handleBlur}
                    error={!!touched.importDate && !!errors.importDate}
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

              <DatePicker
                PopperProps={{
                  sx: {
                    zIndex: 99999,
                  },
                }}
                label='Ngày sản xuất'
                disableFuture
                value={values.manufacturingDate}
                inputFormat='dd/MM/yyyy'
                renderInput={(props) => (
                  <CustomTextField
                    {...(props as any)}
                    mb={1.5}
                    fullWidth
                    name='manufacturingDate'
                    size='small'
                    onBlur={handleBlur}
                    helperText={t(
                      (touched.manufacturingDate &&
                        errors.manufacturingDate) as string,
                    )}
                    error={
                      !!touched.manufacturingDate && !!errors.manufacturingDate
                    }
                  />
                )}
                onChange={(newValue) => {
                  setFieldValue('manufacturingDate', newValue);
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
              getOptionLabel={(value) => {
                return (value as SupplierDropDown).name;
              }}
              onChange={(_, value) => {
                setFieldValue('supplier', value);
              }}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label='Nhà cung cấp'
                  placeholder='Chọn nhà cung cấp'
                  error={!!touched.supplier && !!errors.supplier}
                  helperText={t(
                    (touched.supplier && errors.supplier) as string,
                  )}
                />
              )}
            />

            <CustomTextField
              mb={1.5}
              fullWidth
              name='importQuantity'
              size='small'
              variant='outlined'
              type='number'
              onBlur={handleBlur}
              value={values.importQuantity}
              onChange={handleChange}
              label='Số lượng'
              placeholder='Nhập số lượng'
              error={!!touched.importQuantity && !!errors.importQuantity}
              helperText={t(
                (touched.importQuantity && errors.importQuantity) as string,
              )}
              // InputProps={{
              //   // readOnly: !isEditing,
              //   inputComponent: CurrencyInput as any,
              // }}
            />

            <CustomTextField
              mb={1.5}
              fullWidth
              name='unitImportPrice'
              size='small'
              variant='outlined'
              onBlur={handleBlur}
              value={values.unitImportPrice}
              onChange={handleChange}
              label='Đơn giá nhập'
              placeholder='Đơn giá nhập'
              error={!!touched.unitImportPrice && !!errors.unitImportPrice}
              helperText={t(
                (touched.unitImportPrice && errors.unitImportPrice) as string,
              )}
              InputProps={{
                inputComponent: CurrencyInput as any,
                inputProps: {
                  prefix: '₫ ',
                },
              }}
            />

            <Paragraph ml='auto'>
              <Span fontWeight={500}>Tổng tiền: </Span>{' '}
              {formatCurrency(
                (values?.unitImportPrice || 0) * (values.importQuantity || 1),
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

      <ErrorDialog />
    </Dialog>
  );
};

// const validationSchema = yup.object().shape({
//   importDate: yup.date().required('Vui lòng chọn ngày nhập'),
//   supplier: yup
//     .object()
//     .typeError('Vui lòng chọn nhà cung cấp')
//     .required('Vui lòng chọn nhà cung cấp'),
//   quantity: yup
//     .number()
//     .required('Vui lòng nhập số lượng')
//     .min(1, 'Số lượng phải lớn hơn 0')
//     .max(999, 'Số lượng tối đa là 999'),
// });

export default ExpirationOrderModal;
