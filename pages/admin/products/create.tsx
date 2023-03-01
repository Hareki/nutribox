import { Box } from '@mui/material';
import { ReactElement } from 'react';
import * as yup from 'yup';

import VendorDashboardLayout from 'components/layouts/vendor-dashboard';
import { H3 } from 'components/Typography';
import { ProductForm } from 'pages-sections/admin';

// =============================================================================
CreateProduct.getLayout = function getLayout(page: ReactElement) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================

export default function CreateProduct() {
  const INITIAL_VALUES = {
    name: '',
    tags: '',
    stock: '',
    price: '',
    category: [],
    sale_price: '',
    description: '',
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required('required'),
    category: yup.array().min(1).required('required'),
    description: yup.string().required('required'),
    stock: yup.number().required('required'),
    price: yup.number().required('required'),
    sale_price: yup.number().required('required'),
    tags: yup.string().required('required'),
  });

  const handleFormSubmit = (values: typeof INITIAL_VALUES) => {
    console.log(values);
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Add New Product</H3>

      <ProductForm
        initialValues={INITIAL_VALUES}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
      />
    </Box>
  );
}
