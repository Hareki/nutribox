import { Box, Card } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { Types } from 'mongoose';
import type { GetServerSideProps } from 'next';
import { useSnackbar } from 'notistack';
import type { ReactElement } from 'react';
import { useReducer } from 'react';
import { useState } from 'react';

import type { UpdateSupplierInfoRb } from '../../api/admin/supplier/[id]';

import SupplierController from 'api/controllers/Supplier.controller';
import { checkContextCredentials } from 'api/helpers/auth.helper';
import { serialize } from 'api/helpers/object.helper';
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

AdminSupplierDetails.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

interface AdminSupplierDetailsProps {
  initialSupplier: ISupplier;
}
// FIXME: should generalize the CRUD logic
export default function AdminSupplierDetails({
  initialSupplier,
}: AdminSupplierDetailsProps) {
  const queryClient = useQueryClient();
  const { data: supplier } = useQuery({
    queryKey: ['supplier', initialSupplier.id],
    queryFn: () => apiCaller.getSupplier(initialSupplier.id),
    initialData: initialSupplier,
  });

  const [infoState, dispatchInfo] = useReducer(infoDialogReducer, {
    open: false,
  });

  const [isEditingForm, setIsEditingForm] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: updateSupplier, isLoading } = useMutation<
    ISupplier,
    unknown,
    UpdateSupplierInfoRb
  >({
    mutationFn: (requestBody) =>
      apiCaller.updateSupplier(supplier.id, requestBody),
    onSuccess: () => {
      setIsEditingForm(false);
      enqueueSnackbar('Cập nhật nhà CC thành công', { variant: 'success' });
      queryClient.invalidateQueries(['supplier', supplier.id]);
    },
    onError: (err: AxiosError<JSendFailResponse<any>>) => {
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
    const requestBody: UpdateSupplierInfoRb = {
      name: values.name,
      phone: values.phone,
      email: values.email,
      ...addressRb,
    };

    console.log(
      'file: [id].tsx:79 - handleFormSubmit - requestBody:',
      requestBody,
    );
    updateSupplier(requestBody);
  };

  return (
    <Box py={4}>
      <AdminDetailsViewHeader
        hrefBack='/admin/supplier'
        label='Chi tiết nhà cung cấp'
      />

      <Card sx={{ p: 6 }}>
        <SupplierForm
          supplier={supplier}
          setIsEditing={setIsEditingForm}
          isEditing={isEditingForm}
          isLoading={isLoading}
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

  const isValidId = Types.ObjectId.isValid(context.params.id as string);
  if (!isValidId) {
    return {
      notFound: true,
    };
  }

  const supplier = await SupplierController.getOne({
    id: context.params.id as string,
  });

  if (!supplier) {
    return {
      notFound: true,
    };
  }

  return {
    props: { initialSupplier: serialize(supplier) },
  };
};
