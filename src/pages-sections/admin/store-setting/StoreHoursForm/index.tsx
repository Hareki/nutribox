import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/system';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';

import type { UpdateStoreHoursRb } from '../../../../../pages/api/admin/store';

import StoreHoursInput from './StoreHoursInput';

import type { IStoreHourWithObjectId } from 'api/models/Store.model/StoreHour.schema/types';
import type { IStore } from 'api/models/Store.model/types';
import { transformStoreHoursToFormikValue } from 'helpers/storeHours.helper';
import apiCaller from 'utils/apiCallers/admin/store';

export type WeekDays =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

interface StoreHoursFormProps {
  initialStoreInfo: IStore;
}

const StoreHoursForm = ({ initialStoreInfo }: StoreHoursFormProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate: updateStoreInfo, isLoading } = useMutation<
    IStore,
    unknown,
    UpdateStoreHoursRb
  >({
    mutationFn: (body) => apiCaller.updateStoreInfo(body),
    onSuccess: () => {
      enqueueSnackbar('Cập nhật giờ làm việc thành công', {
        variant: 'success',
      });
      queryClient.invalidateQueries(['store', initialStoreInfo.id]);
    },
  });

  const getInitialValues = (
    initialStoreInfo: IStore,
  ): Record<WeekDays, { from: Date; to: Date }> => ({
    ...transformStoreHoursToFormikValue(initialStoreInfo.storeHours),
  });

  type StoreHoursFormValues = ReturnType<typeof getInitialValues>;

  const handleFormSubmit = (values: StoreHoursFormValues) => {
    const storeHours = initialStoreInfo.storeHours;

    const newStoreHours: IStoreHourWithObjectId[] = storeHours.map(
      (storeHour) => {
        const newStoreHour = values[storeHour.dayOfWeek.toLowerCase()];
        return {
          _id: storeHour._id,
          dayOfWeek: storeHour.dayOfWeek,
          openTime: newStoreHour.from,
          closeTime: newStoreHour.to,
        };
      },
    );

    updateStoreInfo({ id: initialStoreInfo.id, storeHours: newStoreHours });
  };

  const {
    values,
    errors,
    touched,
    // handleChange,
    // handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik<StoreHoursFormValues>({
    initialValues: getInitialValues(initialStoreInfo),
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <form onSubmit={handleSubmit}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box mb={4}>
          {Object.keys(values).map((dayOfWeek) => (
            <StoreHoursInput
              key={dayOfWeek}
              dayOfWeek={dayOfWeek as WeekDays}
              fromValue={values[dayOfWeek].from}
              toValue={values[dayOfWeek].to}
              onFromChange={(value) =>
                setFieldValue(`${dayOfWeek}.from`, value)
              }
              onToChange={(value) => setFieldValue(`${dayOfWeek}.to`, value)}
              fromError={
                !!errors[dayOfWeek]?.from && !!touched[dayOfWeek]?.from
              }
              fromHelperText={errors[dayOfWeek]?.from}
              toError={!!errors[dayOfWeek]?.to && !!touched[dayOfWeek]?.to}
              toHelperText={errors[dayOfWeek]?.to}
            />
          ))}
        </Box>
        <LoadingButton
          loading={isLoading}
          type='submit'
          variant='contained'
          color='primary'
        >
          Lưu thay đổi
        </LoadingButton>
      </LocalizationProvider>
    </form>
  );
};

const toTimeValidation = (from: Date, schema: yup.DateSchema) => {
  return schema.test({
    test: (to) => !from || !to || from < to,
    message: 'To time must be later than From time',
  });
};

const validationSchema = yup.object().shape({
  monday: yup.object().shape({
    from: yup.date().required('Required'),
    to: yup.date().required('Required').when('from', toTimeValidation),
  }),
  tuesday: yup.object().shape({
    from: yup.date().required('Required'),
    to: yup.date().required('Required').when('from', toTimeValidation),
  }),
  wednesday: yup.object().shape({
    from: yup.date().required('Required'),
    to: yup.date().required('Required').when('from', toTimeValidation),
  }),
  thursday: yup.object().shape({
    from: yup.date().required('Required'),
    to: yup.date().required('Required').when('from', toTimeValidation),
  }),
  friday: yup.object().shape({
    from: yup.date().required('Required'),
    to: yup.date().required('Required').when('from', toTimeValidation),
  }),
  saturday: yup.object().shape({
    from: yup.date().required('Required'),
    to: yup.date().required('Required').when('from', toTimeValidation),
  }),
  sunday: yup.object().shape({
    from: yup.date().required('Required'),
    to: yup.date().required('Required').when('from', toTimeValidation),
  }),
});

export default StoreHoursForm;
