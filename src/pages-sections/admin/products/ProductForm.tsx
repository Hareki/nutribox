import { LoadingButton } from '@mui/lab';
import { Autocomplete, Button, Card, Grid, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useFormik } from 'formik';
import type { FC } from 'react';
import { Fragment } from 'react';
import type * as yup from 'yup';
import type { Assign, ObjectShape } from 'yup/lib/object';

import type { UpdateProductInfoRb } from '../../../../pages/api/admin/product/[id]';

import type { IProductCategoryDropdown } from 'api/models/ProductCategory.model/types';
import CurrencyInput from 'components/common/input/CurrencyInput';
import apiCaller from 'utils/apiCallers/admin/product';

export interface ProductInfoFormValues
  extends Omit<UpdateProductInfoRb, 'category'> {
  category: IProductCategoryDropdown;
}

type ProductFormProps = {
  initialValues: any;
  handleFormSubmit: (values: any) => void;
  validationSchema: yup.ObjectSchema<Assign<ObjectShape, any>>;
  isLoading: boolean;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
};

const ProductForm: FC<ProductFormProps> = (props) => {
  const {
    initialValues,
    validationSchema,
    handleFormSubmit,
    isLoading,
    isEditing,
    setIsEditing,
  } = props;
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories', 'dropdown'],
    queryFn: () => apiCaller.getDropdown(),
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
  } = useFormik<ProductInfoFormValues>({
    initialValues,
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <Card sx={{ p: 6 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item sm={6} xs={12}>
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
              helperText={(touched.name && errors.name) as string}
              InputProps={{
                readOnly: !isEditing,
              }}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Autocomplete
              readOnly={!isEditing}
              fullWidth
              size='medium'
              sx={{ mb: 2 }}
              options={categories || []}
              disabled={isLoadingCategories}
              value={values.category}
              getOptionLabel={(value) =>
                (value as IProductCategoryDropdown).name
              }
              onChange={(_, value) => {
                setFieldValue('category', value);
              }}
              renderInput={(params) => (
                <TextField
                  label='Danh mục'
                  placeholder='Chọn danh mục'
                  error={!!touched.category && !!errors.category}
                  helperText={(touched.category && errors.category) as string}
                  {...params}
                  size='medium'
                />
              )}
            />
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
              helperText={(touched.description && errors.description) as string}
              InputProps={{
                readOnly: !isEditing,
              }}
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <TextField
              fullWidth
              name='wholesalePrice'
              size='medium'
              onBlur={handleBlur}
              value={values.wholesalePrice}
              label='Giá gốc'
              onChange={handleChange}
              placeholder='Giá gốc'
              error={!!touched.wholesalePrice && !!errors.wholesalePrice}
              helperText={
                (touched.wholesalePrice && errors.wholesalePrice) as string
              }
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
              size='medium'
              name='retailPrice'
              label='Giá bán'
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder='Giá bán'
              value={values.retailPrice}
              error={!!touched.retailPrice && !!errors.retailPrice}
              helperText={(touched.retailPrice && errors.retailPrice) as string}
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
              helperText={(touched.shelfLife && errors.shelfLife) as string}
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
                >
                  Lưu thay đổi
                </LoadingButton>
                <Button
                  variant='outlined'
                  color='primary'
                  type='submit'
                  onClick={() => {
                    setIsEditing(false);
                    resetForm();
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
                variant='contained'
                color='primary'
                type='submit'
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    </Card>
  );
};

export default ProductForm;
