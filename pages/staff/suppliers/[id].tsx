import { Box, Card } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';
import type { ReactElement } from 'react';
import { useReducer } from 'react';
import { useState } from 'react';

import staffSupplierCaller from 'api-callers/staff/suppliers';
import type { SupplierFormValues } from 'backend/dtos/suppliers/newSupplier.dto';
import type { UpdateSupplierDto } from 'backend/dtos/suppliers/updateSupplier.dto';
import CircularProgressBlock from 'components/common/CircularProgressBlock';
import AdminDetailsViewHeader from 'components/common/layout/header/AdminDetailsViewHeader';
import {
  infoDialogReducer,
  initInfoDialogState,
} from 'components/dialog/info-dialog/reducer';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import { SUPPLIERS_STAFF_ROUTE } from 'constants/routes.ui.constant';
import { transformFormikValueToIAddress } from 'helpers/address.helper';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import { useServerSideErrorDialog } from 'hooks/useServerErrorDialog';
import type { SupplierModel } from 'models/supplier.model';
import SupplierForm from 'pages-sections/admin/supplier/SupplierForm';

AdminSupplierDetails.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

export default function AdminSupplierDetails() {
  const router = useRouter();
  const id = router.query.id as string;
  const queryClient = useQueryClient();
  const { data: supplier, isLoading: isLoadingSupplier } = useQuery({
    queryKey: ['suppliers', id],
    queryFn: () => staffSupplierCaller.getSupplier(id),
  });
  const { t } = useCustomTranslation([
    'supplier',
    'customerAddress',
    'customerOrder',
  ]);

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
  const { mutate: updateSupplier, isLoading: isUpdatingSupplier } = useMutation<
    SupplierModel,
    unknown,
    UpdateSupplierDto
  >({
    mutationFn: (requestBody) =>
      staffSupplierCaller.updateSupplier(id, requestBody),
    onSuccess: () => {
      setIsEditingForm(false);
      enqueueSnackbar('Cập nhật nhà CC thành công', { variant: 'success' });
      queryClient.invalidateQueries(['suppliers', id]);
    },
    onError: dispatchErrorDialog,
  });

  const handleFormSubmit = (values: SupplierFormValues) => {
    const addressRb = transformFormikValueToIAddress(values);
    const requestBody: UpdateSupplierDto = {
      name: values.name,
      phone: values.phone,
      email: values.email,
      ...addressRb!,
    };

    updateSupplier(requestBody);
  };

  if (isLoadingSupplier) {
    return <CircularProgressBlock />;
  }

  return (
    <Box py={4}>
      <AdminDetailsViewHeader
        hrefBack={SUPPLIERS_STAFF_ROUTE}
        label='Chi tiết nhà cung cấp'
      />

      <Card sx={{ p: 6 }}>
        <SupplierForm
          supplier={supplier}
          setIsEditing={setIsEditingForm}
          isEditing={isEditingForm}
          isLoading={isUpdatingSupplier}
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
    'supplier',
    'customerAddress',
    'customerOrder',
    'common',
  ]);

  return { props: { ...locales } };
};
