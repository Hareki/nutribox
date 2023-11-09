import { Box, Card } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';
import type { ReactElement } from 'react';
import { useReducer } from 'react';
import { useState } from 'react';

import staffCategoryCaller from 'api-callers/staff/categories';
import type { NewProductCategoryDto } from 'backend/dtos/categories/newProductCategory.dto';
import AdminDetailsViewHeader from 'components/common/layout/header/AdminDetailsViewHeader';
import {
  infoDialogReducer,
  initInfoDialogState,
} from 'components/dialog/info-dialog/reducer';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import { CATEGORIES_STAFF_ROUTE } from 'constants/routes.ui.constant';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import { useServerSideErrorDialog } from 'hooks/useServerErrorDialog';
import type { ProductCategoryModel } from 'models/productCategory.model';
import CategoryForm from 'pages-sections/staff/category/CategoryForm';

AdminEmployeeCreate.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

export default function AdminEmployeeCreate() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [infoState, dispatchInfo] = useReducer(
    infoDialogReducer,
    initInfoDialogState,
  );

  const { t } = useCustomTranslation(['productCategory', 'account']);
  const { ErrorDialog, dispatchErrorDialog } = useServerSideErrorDialog({
    t,
    operationName: 'Thêm nhân viên',
  });

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { mutate: createCategory, isLoading } = useMutation<
    ProductCategoryModel,
    unknown,
    NewProductCategoryDto
  >({
    mutationFn: async (requestBody) =>
      staffCategoryCaller.createCategory(requestBody),
    onSuccess: () => {
      enqueueSnackbar(t('ProductCategory.AddInfo.Success'), {
        variant: 'success',
      });

      setIsRedirecting(true);
      router.push(CATEGORIES_STAFF_ROUTE);
    },
    onError: dispatchErrorDialog,
  });

  const handleFormSubmit = (values: NewProductCategoryDto) => {
    const requestBody: NewProductCategoryDto = {
      ...values,
    };

    createCategory(requestBody);
  };

  return (
    <Box py={4}>
      <AdminDetailsViewHeader
        hrefBack={CATEGORIES_STAFF_ROUTE}
        label='Thêm nhân viên'
      />

      <Card sx={{ p: 6 }}>
        <CategoryForm
          isEditing
          isLoading={isLoading || isRedirecting}
          handleFormSubmit={handleFormSubmit}
          infoState={infoState}
          dispatchInfo={dispatchInfo}
        />
      </Card>
      <ErrorDialog />
    </Box>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const locales = await serverSideTranslations(locale ?? 'vn', [
    'productCategory',
    'common',
  ]);

  return { props: { ...locales } };
};
