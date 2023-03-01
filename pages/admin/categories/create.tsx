import { Box } from '@mui/material';
import { ReactElement } from 'react';
import * as yup from 'yup';

import VendorDashboardLayout from 'components/layouts/vendor-dashboard';
import { H3 } from 'components/Typography';
import { CategoryForm } from 'pages-sections/admin';
// import api from "utils/__api__/products";

// =============================================================================
CreateCategory.getLayout = function getLayout(page: ReactElement) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================

export default function CreateCategory() {
  const INITIAL_VALUES = {
    name: '',
    parent: [],
    featured: false,
  };

  // form field validation schema
  const validationSchema = yup.object().shape({
    name: yup.string().required('required'),
  });

  const handleFormSubmit = () => {};

  return (
    <Box py={4}>
      <H3 mb={2}>Create Category</H3>

      <CategoryForm
        initialValues={INITIAL_VALUES}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
      />
    </Box>
  );
}
