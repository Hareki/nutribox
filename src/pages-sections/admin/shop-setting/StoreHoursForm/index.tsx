import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/system';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik } from 'formik';
import * as yup from 'yup';

import StoreHoursInput from './StoreHoursInput';
export type WeekDays =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

const StoreHoursForm = () => {
  const getInitialValues = (): Record<WeekDays, { from: Date; to: Date }> => ({
    monday: { from: new Date(), to: new Date() },
    tuesday: { from: new Date(), to: new Date() },
    wednesday: { from: new Date(), to: new Date() },
    thursday: { from: new Date(), to: new Date() },
    friday: { from: new Date(), to: new Date() },
    saturday: { from: new Date(), to: new Date() },
    sunday: { from: new Date(), to: new Date() },
  });

  type StoreHoursFormValues = ReturnType<typeof getInitialValues>;

  const handleFormSubmit = (values: StoreHoursFormValues) => {
    console.log(values);
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
    initialValues: getInitialValues(),
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <form onSubmit={handleSubmit}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          loading={false}
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
