import { Box, Card } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import type { ReactElement } from 'react';
import { useReducer } from 'react';
import { useState } from 'react';

import type { CreateSupplierRb } from '../../api/admin/supplier/create';

import { checkContextCredentials } from 'api/helpers/auth.helper';
import type { ISupplier } from 'api/models/Supplier.model/types';
import type { JSendFailResponse } from 'api/types/response.type';
import AdminDetailsViewHeader from 'components/common/layout/header/AdminDetailsViewHeader';
import { infoDialogReducer } from 'components/dialog/info-dialog/reducer';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import { transformFormikValueToAddress } from 'helpers/address.helper';
import { getMessageList } from 'helpers/feedback.helper';
import type { SupplierInfoFormValues } from 'pages-sections/admin/supplier/SupplierForm';
import SupplierForm from 'pages-sections/admin/supplier/SupplierForm';
import apiCaller from 'utils/apiCallers/admin/supplier';

AdminSupplierCreate.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

export default function AdminSupplierCreate() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [infoState, dispatchInfo] = useReducer(infoDialogReducer, {
    open: false,
  });

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { mutate: createSupplier, isLoading } = useMutation<
    ISupplier,
    AxiosError<JSendFailResponse<any>>,
    CreateSupplierRb
  >({
    mutationFn: async (requestBody) => apiCaller.createSupplier(requestBody),
    onSuccess: () => {
      enqueueSnackbar('Thêm nhà cung cấp thành công', {
        variant: 'success',
      });

      setIsRedirecting(true);
      router.push('/admin/supplier');
    },
    onError: (err) => {
      console.log(err);
      if (err.response.data.data) {
        dispatchInfo({
          type: 'open_dialog',
          payload: {
            title: 'Có lỗi xảy ra',
            content: getMessageList(err.response.data.data),
            variant: 'error',
          },
        });
        return;
      }
      enqueueSnackbar('Đã có lỗi xảy ra, vui lòng thử lại sau', {
        variant: 'error',
      });
    },
  });

  const handleFormSubmit = (values: SupplierInfoFormValues) => {
    const addressRb = transformFormikValueToAddress(values);
    const requestBody: CreateSupplierRb = {
      name: values.name,
      phone: values.phone,
      email: values.email,
      ...addressRb,
    };

    console.log(
      'file: [id].tsx:79 - handleFormSubmit - requestBody:',
      JSON.stringify(requestBody),
    );
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
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { isNotAuthorized, blockingResult } = await checkContextCredentials(
    context,
  );
  if (isNotAuthorized) return blockingResult;

  return {
    props: {},
  };
};
