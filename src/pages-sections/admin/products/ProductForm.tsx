import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useFormik } from 'formik';
import type { FC } from 'react';
import { Fragment } from 'react';

import apiCaller from 'api-callers/staff/products';
import type { ProductFormValues } from 'backend/dtos/product/newProduct.dto';
import { ProductFormSchema } from 'backend/dtos/product/newProduct.dto';
import type { ExtendedCommonProductModel } from 'backend/services/product/helper';
import CurrencyInput from 'components/common/input/CurrencyInput';
import CustomSwitch from 'components/common/input/CustomSwitch';
import type { ProductCategoryModel } from 'models/productCategory.model';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

const getInitialValues = (
  product: ExtendedCommonProductModel | undefined,
): ProductFormValues => {
  if (product) {
    return {
      name: product.name,
      productCategory: product.productCategory,
      description: product.description,
      shelfLife: product.shelfLife,
      retailPrice: product.retailPrice,
      available: product.available,
      maxQuantity: product.maxQuantity,
    };
  }
  return {
    name: '',
    productCategory: null as any,
    description: '',
    shelfLife: null as any,
    retailPrice: null as any,
    available: true,
    maxQuantity: null as any,
  };
};

type ProductFormProps = {
  setSubmissionClicked?: (value: boolean) => void;
  product?: ExtendedCommonProductModel;
  handleFormSubmit: (values: any) => void;
  isLoading: boolean;
  isEditing: boolean;
  setIsEditing?: (value: boolean) => void;
  t: (key: string) => string;
};

const ProductForm: FC<ProductFormProps> = (props) => {
  const {
    setSubmissionClicked,
    product,
    handleFormSubmit,
    isLoading,
    isEditing,
    setIsEditing,
    t,
  } = props;

  const isAdding = !product;

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories', 'dropdown'],
    queryFn: () => apiCaller.getCategoryDropdown(),
  });

  const {
    resetForm,
    values,
    setFieldValue,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik<ProductFormValues>({
    enableReinitialize: true,
    initialValues: getInitialValues(product),
    validationSchema: toFormikValidationSchema(ProductFormSchema),
    onSubmit: handleFormSubmit,
  });

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item md={5} xs={12}>
            <TextField
              fullWidth
              name='name'
              label='Tên sản phẩm'
              size='medium'
              placeholder='Tên sản phẩm'
              value={values.name}
              onBlur={handleBlur}
              onChange={handleChange}
              error={!!touched.name && !!errors.name}
              helperText={t((touched.name && errors.name) as string)}
              InputProps={{
                readOnly: !isEditing,
              }}
            />
          </Grid>
          <Grid item md={5} xs={9}>
            <Autocomplete
              readOnly={!isEditing}
              fullWidth
              size='medium'
              sx={{ mb: 2 }}
              options={categories || []}
              disabled={isLoadingCategories}
              value={values.productCategory}
              getOptionLabel={(value) => (value as ProductCategoryModel).name}
              onChange={(_, value) => {
                setFieldValue('productCategory', value);
              }}
              renderInput={(params) => (
                <TextField
                  label='Danh mục'
                  placeholder='Chọn danh mục'
                  error={!!touched.productCategory && !!errors.productCategory}
                  helperText={t(
                    (touched.productCategory &&
                      errors.productCategory) as string,
                  )}
                  {...params}
                  size='medium'
                />
              )}
            />
          </Grid>
          <Grid item xs={3} md={2}>
            <FormGroup
              sx={{
                margin: '0',
                '& .MuiFormControlLabel-root': {
                  margin: '0',
                },
              }}
            >
              <FormControlLabel
                sx={{
                  '& .MuiFormControlLabel-label.Mui-disabled': {
                    color: 'text.primary',
                  },
                }}
                labelPlacement='top'
                control={
                  <CustomSwitch
                    disabled={!isEditing}
                    color='primary'
                    checked={values.available}
                    onChange={(e) => {
                      setFieldValue('available', e.target.checked);
                    }}
                  />
                }
                label='Bày bán'
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12}>
            <TextField
              rows={6}
              multiline
              fullWidth
              size='medium'
              name='description'
              label='Mô tả'
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder='Mô tả'
              value={values.description}
              error={!!touched.description && !!errors.description}
              helperText={t(
                (touched.description && errors.description) as string,
              )}
              InputProps={{
                readOnly: !isEditing,
              }}
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <TextField
              fullWidth
              name='maxQuantity'
              size='medium'
              onBlur={handleBlur}
              value={values.maxQuantity}
              label='Tồn kho tối đa'
              onChange={handleChange}
              placeholder='Tồn kho tối đa'
              error={!!touched.maxQuantity && !!errors.maxQuantity}
              helperText={t(
                (touched.maxQuantity && errors.maxQuantity) as string,
              )}
              InputProps={{
                readOnly: !isEditing,
                inputComponent: CurrencyInput as any,
              }}
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <TextField
              fullWidth
              size='medium'
              name='retailPrice'
              label='Giá bán'
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder='Giá bán'
              value={values.retailPrice}
              error={!!touched.retailPrice && !!errors.retailPrice}
              helperText={t(
                (touched.retailPrice && errors.retailPrice) as string,
              )}
              InputProps={{
                readOnly: !isEditing,
                inputComponent: CurrencyInput as any,
                inputProps: {
                  prefix: '₫ ',
                },
              }}
            />
          </Grid>

          <Grid item sm={4} xs={12}>
            <TextField
              fullWidth
              name='shelfLife'
              label='Số ngày sử dụng'
              size='medium'
              placeholder='Số ngày sử dụng'
              onBlur={handleBlur}
              value={values.shelfLife}
              onChange={handleChange}
              error={!!touched.shelfLife && !!errors.shelfLife}
              helperText={t((touched.shelfLife && errors.shelfLife) as string)}
              InputProps={{
                readOnly: !isEditing,
                inputComponent: CurrencyInput as any,
              }}
            />
          </Grid>

          <Grid item xs={12} display='flex' justifyContent='flex-end' gap={2}>
            {isEditing ? (
              <Fragment>
                <LoadingButton
                  loading={isLoading}
                  variant='contained'
                  color='primary'
                  type='submit'
                  onClick={() => setSubmissionClicked?.(true)}
                >
                  {isAdding ? 'Thêm sản phẩm' : 'Lưu thay đổi'}
                </LoadingButton>
                <Button
                  disabled={isLoading}
                  variant='outlined'
                  color='primary'
                  onClick={() => {
                    setIsEditing?.(false);
                    resetForm({
                      values: getInitialValues(product),
                    });
                  }}
                  sx={{
                    px: 3,
                  }}
                >
                  Huỷ
                </Button>
              </Fragment>
            ) : (
              <Button
                startIcon={<EditRoundedIcon />}
                variant='contained'
                color='primary'
                type='submit'
                onClick={() => setIsEditing?.(true)}
              >
                Chỉnh sửa
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    </Fragment>
  );
};

// const validationSchema = yup.object().shape({
//   name: yup
//     .string()
//     .required('Vui lòng nhập tên sản phẩm')
//     .max(100, 'Tên sản phẩm không được quá 100 ký tự'),
//   category: yup
//     .object()
//     .typeError('Vui lòng chọn danh mục')
//     .required('Vui lòng chọn danh mục'),
//   description: yup
//     .string()
//     .required('Vui lòng nhập mô tả sản phẩm')
//     .max(500, 'Mô tả sản phẩm không được quá 500 ký tự'),
//   shelfLife: yup
//     .number()
//     .typeError('Vui lòng số ngày sử dụng')
//     .required('Vui lòng số ngày sử dụng')
//     .min(1, 'Số ngày sử dụng phải lớn hơn 0'),
//   wholesalePrice: yup
//     .number()
//     .typeError('Vui lòng nhập giá gốc')
//     .required('Vui lòng nhập giá gốc')
//     .min(1, 'Giá gốc phải lớn hơn 0'),
//   retailPrice: yup
//     .number()
//     .typeError('Vui lòng nhập giá bán')
//     .required('Vui lòng nhập giá bán')
//     .min(1, 'Giá bán phải lớn hơn 0')
//     .test(
//       'retailPrice-greater-than-wholesalePrice',
//       'Giá bán phải lớn hơn giá gốc',
//       function (value) {
//         const { wholesalePrice } = this.parent;
//         return value && value > wholesalePrice;
//       },
//     ),
// });

export default ProductForm;
