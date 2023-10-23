import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { LoadingButton } from '@mui/lab';
import { Button, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import * as yup from 'yup';

import StoreHoursInput from './StoreHoursInput';

import staffStoreCaller from 'api-callers/staff/stores';
import type { UpdateStoreWorkTimesDto } from 'backend/dtos/store/updateStoreWorkTimes.dto';
import type { DayOfWeek } from 'backend/enums/entities.enum';
import { STORE_ID } from 'constants/temp.constant';
import {
  transformFormikValuesToStoreWorkTimes,
  transformStoreHoursToFormikValue,
} from 'helpers/storeHours.helper';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import type { PopulateStoreFields } from 'models/store.model';

export type WeekDays =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

interface StoreHoursFormProps {
  initialStoreInfo: PopulateStoreFields<'storeWorkTimes'>;
}

const StoreHoursForm = ({ initialStoreInfo }: StoreHoursFormProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useCustomTranslation(['store', 'storeWorkTime']);
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateStoreInfo, isLoading } = useMutation<
    PopulateStoreFields<'storeWorkTimes'>,
    unknown,
    UpdateStoreWorkTimesDto
  >({
    mutationFn: (body) => staffStoreCaller.updateStoreWorkTimes(STORE_ID, body),
    onSuccess: () => {
      enqueueSnackbar('Cập nhật giờ làm việc thành công', {
        variant: 'success',
      });
      setIsEditing(false);
      queryClient.refetchQueries(['stores', initialStoreInfo.id]);
    },
  });

  const getInitialValues = (
    initialStoreInfo: PopulateStoreFields<'storeWorkTimes'>,
  ): Record<DayOfWeek, { from: Date; to: Date }> =>
    transformStoreHoursToFormikValue(initialStoreInfo.storeWorkTimes);

  type StoreHoursFormValues = ReturnType<typeof getInitialValues>;

  const handleFormSubmit = (values: StoreHoursFormValues) => {
    const newStoreWorkTimes = transformFormikValuesToStoreWorkTimes(values);

    updateStoreInfo(newStoreWorkTimes);
  };

  const {
    values,
    errors,
    touched,
    // handleChange,
    // handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
    setFieldTouched,
  } = useFormik<StoreHoursFormValues>({
    initialValues: getInitialValues(initialStoreInfo),
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  const handleTouchedBlur = (fieldName: string) => {
    return () => {
      setFieldTouched(fieldName, true);
    };
  };

  return (
    <form onSubmit={handleSubmit}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box mb={4}>
          {Object.keys(values).map((dayOfWeek) => (
            <StoreHoursInput
              handleTouchedBlur={handleTouchedBlur}
              isEditing={isEditing}
              key={dayOfWeek}
              name={dayOfWeek}
              dayOfWeek={dayOfWeek as WeekDays}
              fromValue={values[dayOfWeek].from}
              toValue={values[dayOfWeek].to}
              onFromChange={(value) =>
                setFieldValue(`${dayOfWeek}.from`, value)
              }
              onToChange={(value) => setFieldValue(`${dayOfWeek}.to`, value)}
              // fromError={
              //   !!errors[dayOfWeek]?.from && !!touched[dayOfWeek]?.from
              // }
              fromError={errors[dayOfWeek]?.from}
              fromHelperText={t(errors[dayOfWeek]?.from)}
              // toError={!!errors[dayOfWeek]?.to && !!touched[dayOfWeek]?.to}
              toError={!!errors[dayOfWeek]?.to}
              toHelperText={t(errors[dayOfWeek]?.to)}
            />
          ))}
        </Box>
        <Grid item xs={12} display='flex' justifyContent='flex-end' gap={2}>
          {isEditing ? (
            <>
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
                  resetForm({
                    values: getInitialValues(initialStoreInfo),
                  });
                }}
                sx={{
                  px: 3,
                }}
              >
                Huỷ
              </Button>
            </>
          ) : (
            <Button
              startIcon={<EditRoundedIcon />}
              variant='contained'
              color='primary'
              type='submit'
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa
            </Button>
          )}
        </Grid>
      </LocalizationProvider>
    </form>
  );
};

const toTimeValidation = (from: Date, schema: yup.DateSchema) => {
  return schema.test({
    test: (to) => {
      const fromHours = from?.getHours() || 0;
      const toHours = to?.getHours() || 0;
      return !from || !to || toHours - fromHours > 0;
    },
    message: 'StoreWorkTime.OpenTime.Before.CloseTime',
  });
};

const validationSchema = yup.object().shape({
  MONDAY: yup.object().shape({
    from: yup.date().required('StoreWorkTime.OpenTime.Required'),
    to: yup
      .date()
      .required('StoreWorkTime.OpenTime.Required')
      .when('from', toTimeValidation),
  }),
  TUESDAY: yup.object().shape({
    from: yup.date().required('StoreWorkTime.OpenTime.Required'),
    to: yup
      .date()
      .required('StoreWorkTime.OpenTime.Required')
      .when('from', toTimeValidation),
  }),
  WEDNESDAY: yup.object().shape({
    from: yup.date().required('StoreWorkTime.OpenTime.Required'),
    to: yup
      .date()
      .required('StoreWorkTime.OpenTime.Required')
      .when('from', toTimeValidation),
  }),
  THURSDAY: yup.object().shape({
    from: yup.date().required('StoreWorkTime.OpenTime.Required'),
    to: yup
      .date()
      .required('StoreWorkTime.OpenTime.Required')
      .when('from', toTimeValidation),
  }),
  FRIDAY: yup.object().shape({
    from: yup.date().required('StoreWorkTime.OpenTime.Required'),
    to: yup
      .date()
      .required('StoreWorkTime.OpenTime.Required')
      .when('from', toTimeValidation),
  }),
  SATURDAY: yup.object().shape({
    from: yup.date().required('StoreWorkTime.OpenTime.Required'),
    to: yup
      .date()
      .required('StoreWorkTime.OpenTime.Required')
      .when('from', toTimeValidation),
  }),
  SUNDAY: yup.object().shape({
    from: yup.date().required('StoreWorkTime.OpenTime.Required'),
    to: yup
      .date()
      .required('StoreWorkTime.OpenTime.Required')
      .when('from', toTimeValidation),
  }),
});

export default StoreHoursForm;
