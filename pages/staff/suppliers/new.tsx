import { Box, Card } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';
import type { ReactElement } from 'react';
import { useReducer } from 'react';
import { useState } from 'react';

import staffSupplierCaller from 'api-callers/staff/suppliers';
import type {
  NewSupplierDto,
  SupplierFormValues,
} from 'backend/dtos/suppliers/newSupplier.dto';
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
import SupplierForm from 'pages-sections/staff/supplier/SupplierForm';

AdminSupplierCreate.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

export default function AdminSupplierCreate() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [infoState, dispatchInfo] = useReducer(
    infoDialogReducer,
    initInfoDialogState,
  );

  const { t } = useCustomTranslation([
    'supplier',
    'customerAddress',
    'customerOrder',
  ]);
  const { ErrorDialog, dispatchErrorDialog } = useServerSideErrorDialog({
    t,
    operationName: 'Thêm nhà cung cấp',
  });

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { mutate: createSupplier, isLoading } = useMutation<
    SupplierModel,
    unknown,
    NewSupplierDto
  >({
    mutationFn: async (requestBody) =>
      staffSupplierCaller.createSupplier(requestBody),
    onSuccess: () => {
      enqueueSnackbar('Thêm nhà cung cấp thành công', {
        variant: 'success',
      });

      setIsRedirecting(true);
      router.push(SUPPLIERS_STAFF_ROUTE);
    },
    onError: dispatchErrorDialog,
  });

  const handleFormSubmit = (values: SupplierFormValues) => {
    const addressRb = transformFormikValueToIAddress(values);
    const requestBody: NewSupplierDto = {
      name: values.name,
      phone: values.phone,
      email: values.email,
      ...addressRb!,
    };

    createSupplier(requestBody);
  };

  return (
    <Box py={4}>
      <AdminDetailsViewHeader
        hrefBack='/admin/supplier'
        label='Thêm nhà cung cấp'
      />

      <Card sx={{ p: 6 }}>
        <SupplierForm
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
    'supplier',
    'customerAddress',
    'customerOrder',
    'common',
  ]);

  return { props: { ...locales } };
};
