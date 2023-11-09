import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import type { Dispatch, FC } from 'react';
import { Fragment } from 'react';

import {
  NewProductCategoryDtoSchema,
  type NewProductCategoryDto,
} from 'backend/dtos/categories/newProductCategory.dto';
import CustomSwitch from 'components/common/input/CustomSwitch';
import InfoDialog from 'components/dialog/info-dialog';
import type {
  InfoDialogAction,
  InfoDialogState,
} from 'components/dialog/info-dialog/reducer';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import type { ProductCategoryModel } from 'models/productCategory.model';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

const getInitialValues = (initialCategory?: ProductCategoryModel) => {
  return {
    name: initialCategory?.name || '',
    available: initialCategory?.available || true,
  };
};

type CategoryFormProps = {
  category?: ProductCategoryModel;
  handleFormSubmit: (values: any) => void;
  isLoading: boolean;
  isEditing: boolean;
  setIsEditing?: (value: boolean) => void;
  infoState: InfoDialogState;
  dispatchInfo: Dispatch<InfoDialogAction>;
};

const CategoryForm: FC<CategoryFormProps> = (props) => {
  const {
    handleFormSubmit,
    isLoading,
    isEditing,
    setIsEditing,
    infoState,
    dispatchInfo,
    category,
  } = props;

  const { t } = useCustomTranslation(['productCategory']);

  const isAdding = !props.category;

  const {
    resetForm,
    values,
    setFieldValue,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik<NewProductCategoryDto>({
    initialValues: getInitialValues(category),
    validationSchema: toFormikValidationSchema(NewProductCategoryDtoSchema),
    onSubmit: handleFormSubmit,
  });

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item md={6} xs={6}>
            <TextField
              fullWidth
              name='name'
              label='Tên danh mục'
              size='medium'
              placeholder='Tên danh mục'
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

          <Grid item md={6} xs={3}>
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
                  alignItems: 'flex-start',
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
                label='Hoạt động'
              />
            </FormGroup>
          </Grid>

          <Grid item xs={12} display='flex' justifyContent='flex-start' gap={2}>
            {isEditing ? (
              <Fragment>
                <LoadingButton
                  loading={isLoading}
                  variant='contained'
                  color='primary'
                  type='submit'
                >
                  {isAdding ? 'Thêm danh mục' : 'Lưu thay đổi'}
                </LoadingButton>
                {!isAdding && (
                  <Button
                    variant='outlined'
                    color='primary'
                    onClick={() => {
                      setIsEditing?.(false);
                      resetForm({
                        values: getInitialValues(props.category),
                      });
                    }}
                    sx={{
                      px: 3,
                    }}
                  >
                    Hủy
                  </Button>
                )}
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

      <InfoDialog
        open={infoState.open}
        content={infoState.content}
        title={infoState.title}
        variant={infoState.variant}
        handleClose={() => dispatchInfo({ type: 'close_dialog' })}
      />
    </Fragment>
  );
};

export default CategoryForm;
