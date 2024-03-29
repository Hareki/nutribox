import { Box, Card } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';
import type { ReactElement } from 'react';
import { useReducer } from 'react';
import { useState } from 'react';

import staffCategoryCaller from 'api-callers/staff/categories';
import type { UpdateProductCategoryDto } from 'backend/dtos/categories/updateProductCategory.dto';
import CircularProgressBlock from 'components/common/CircularProgressBlock';
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

AdminCategoryDetails.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

export default function AdminCategoryDetails() {
  const router = useRouter();
  const id = router.query.id as string;
  const queryClient = useQueryClient();
  const { data: category, isLoading: isLoadingCategory } = useQuery({
    queryKey: ['staff', 'categories', id],
    queryFn: () => staffCategoryCaller.getCategory(id),
  });
  const { t } = useCustomTranslation(['productCategory', 'account']);

  const { ErrorDialog, dispatchErrorDialog } = useServerSideErrorDialog({
    t,
    operationName: 'Cập nhật thông tin',
  });

  const [infoState, dispatchInfo] = useReducer(
    infoDialogReducer,
    initInfoDialogState,
  );

  const [isEditingForm, setIsEditingForm] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: updateCategory, isLoading: isUpdatingCategory } = useMutation<
    ProductCategoryModel,
    unknown,
    UpdateProductCategoryDto
  >({
    mutationFn: (requestBody) =>
      staffCategoryCaller.updateCategory(id, requestBody),
    onSuccess: () => {
      setIsEditingForm(false);
      enqueueSnackbar(t('ProductCategory.UpdateInfo.Success'), {
        variant: 'success',
      });
      queryClient.invalidateQueries(['staff', 'categories', id]);
    },
    onError: dispatchErrorDialog,
  });

  const handleFormSubmit = (values: UpdateProductCategoryDto) => {
    const requestBody: UpdateProductCategoryDto = {
      ...values,
    };

    updateCategory(requestBody);
  };

  if (isLoadingCategory) {
    return <CircularProgressBlock />;
  }

  return (
    <Box py={4}>
      <AdminDetailsViewHeader
        hrefBack={CATEGORIES_STAFF_ROUTE}
        label='Chi tiết danh mục'
      />

      <Card sx={{ p: 6 }}>
        <CategoryForm
          category={category}
          setIsEditing={setIsEditingForm}
          isEditing={isEditingForm}
          isLoading={isUpdatingCategory}
          handleFormSubmit={handleFormSubmit}
          infoState={infoState}
          dispatchInfo={dispatchInfo}
        />
      </Card>

      <ErrorDialog />
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const locales = await serverSideTranslations(locale ?? 'vn', [
    'productCategory',
    'common',
  ]);

  return { props: { ...locales } };
};
