import { Place } from '@mui/icons-material';
import { Box, Button, Grid, TextField } from '@mui/material';
import { Formik } from 'formik';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import * as yup from 'yup';

import type { IAccountAddress } from 'api/models/Account.model/AccountAddress.schema/types';
import Card1 from 'components/common/Card1';
import UserDashboardHeader from 'components/common/layout/header/UserDashboardHeader';
import CustomerDashboardLayout from 'components/layouts/customer-dashboard';
import CustomerDashboardNavigation from 'components/layouts/customer-dashboard/Navigations';
import api from 'utils/__api__/address';

type AddressEditorProps = {
  accountId: string;
  editingAddress: IAccountAddress;
  setIsAddMode: (isAddMode: boolean) => void;
  setEditingAddress: (info: IAccountAddress) => void;
};

const AddressEditor: NextPage<AddressEditorProps> = ({
  accountId,
  editingAddress,
  setIsAddMode,
  setEditingAddress,
}) => {
  // const INITIAL_VALUES = {
  //   name: address.title || '',
  //   address: address.street || '',
  //   contact: address.phone || '',
  // };

  const INITIAL_VALUES = {
    title: editingAddress?.title || '',
    streetAddress: editingAddress?.streetAddress || '',
    ward: editingAddress?.ward || '',
    district: editingAddress?.district || '',
    province: editingAddress?.province || '',
  };

  const checkoutSchema = yup.object().shape({
    name: yup.string().required('required'),
    address: yup.string().required('required'),
    contact: yup.string().required('required'),
  });

  const handleFormSubmit = async (values: any) => {
    console.log(values);
  };

  const HEADER_LINK = (
    <Link href='/address' passHref legacyBehavior>
      <Button
        color='primary'
        sx={{ bgcolor: 'primary.light', px: 4 }}
        onClick={() => {
          setIsAddMode(false);
          setEditingAddress(null);
        }}
      >
        Huỷ bỏ
      </Button>
    </Link>
  );

  return (
    <CustomerDashboardLayout>
      <UserDashboardHeader
        icon={Place}
        button={HEADER_LINK}
        title='Edit Address'
        navigation={<CustomerDashboardNavigation />}
      />

      <Card1>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={INITIAL_VALUES}
          validationSchema={checkoutSchema}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box mb={4}>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      name='name'
                      label='Name'
                      onBlur={handleBlur}
                      value={values.name}
                      onChange={handleChange}
                      error={!!touched.name && !!errors.name}
                      helperText={(touched.name && errors.name) as string}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      name='address'
                      onBlur={handleBlur}
                      label='Address Line'
                      value={values.address}
                      onChange={handleChange}
                      error={!!touched.address && !!errors.address}
                      helperText={(touched.address && errors.address) as string}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label='Phone'
                      name='contact'
                      onBlur={handleBlur}
                      value={values.contact}
                      onChange={handleChange}
                      error={!!touched.contact && !!errors.contact}
                      helperText={(touched.contact && errors.contact) as string}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Button type='submit' variant='contained' color='primary'>
                Save Changes
              </Button>
            </form>
          )}
        </Formik>
      </Card1>
    </CustomerDashboardLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await api.getIds();

  return {
    paths: paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const address = await api.getAddress(String(params.id));
  return { props: { address } };
};

export default AddressEditor;
