import { Button, Grid, TextField } from '@mui/material';
import { Formik } from 'formik';
import type { FC } from 'react';

import { H4 } from 'components/abstract/Typography';

const ShippingVatForm: FC = () => {
  const initialValues = { vat: 2, shipping: 10 };

  const handleFormSubmit = async (values) => {
    console.log(values);
  };

  return (
    <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit} encType='multipart/form-data'>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <H4>Shipping and Vat</H4>
            </Grid>

            <Grid item md={7} xs={12}>
              <TextField
                fullWidth
                color='info'
                size='medium'
                type='number'
                name='shipping'
                onBlur={handleBlur}
                label='Shipping Charge'
                onChange={handleChange}
                value={values.shipping}
                error={!!touched.shipping && !!errors.shipping}
                helperText={(touched.shipping && errors.shipping) as string}
              />
            </Grid>

            <Grid item md={7} xs={12}>
              <TextField
                fullWidth
                name='vat'
                color='info'
                size='medium'
                type='number'
                label='VAT (%)'
                value={values.vat}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.vat && !!errors.vat}
                helperText={(touched.vat && errors.vat) as string}
              />
            </Grid>
          </Grid>

          <Button type='submit' color='info' variant='contained' sx={{ mt: 4 }}>
            Save Changes
          </Button>
        </form>
      )}
    </Formik>
  );
};

export default ShippingVatForm;
