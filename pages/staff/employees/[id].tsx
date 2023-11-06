import { Box, Card } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';
import type { ReactElement } from 'react';
import { useReducer } from 'react';
import { useState } from 'react';

import staffEmployeeCaller from 'api-callers/staff/employees';
import type {
  UpdateEmployeeDto,
  UpdateEmployeeFormValues,
} from 'backend/dtos/employees/UpdateEmployee.dto';
import type { CommonEmployeeModel } from 'backend/services/employee/helper';
import CircularProgressBlock from 'components/common/CircularProgressBlock';
import AdminDetailsViewHeader from 'components/common/layout/header/AdminDetailsViewHeader';
import {
  infoDialogReducer,
  initInfoDialogState,
} from 'components/dialog/info-dialog/reducer';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import { EMPLOYEES_STAFF_ROUTE } from 'constants/routes.ui.constant';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import { useServerSideErrorDialog } from 'hooks/useServerErrorDialog';
import EmployeeForm from 'pages-sections/staff/employee/EmployeeForm';

AdminEmployeeDetails.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

export default function AdminEmployeeDetails() {
  const router = useRouter();
  const id = router.query.id as string;
  const queryClient = useQueryClient();
  const { data: employee, isLoading: isLoadingEmployee } = useQuery({
    queryKey: ['staff', 'employees', id],
    queryFn: () => staffEmployeeCaller.getEmployee(id),
  });
  const { t } = useCustomTranslation(['employee', 'account']);

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
  const { mutate: updateEmployee, isLoading: isUpdatingEmployee } = useMutation<
    CommonEmployeeModel,
    unknown,
    UpdateEmployeeDto
  >({
    mutationFn: (requestBody) =>
      staffEmployeeCaller.updateEmployee(id, requestBody),
    onSuccess: () => {
      setIsEditingForm(false);
      enqueueSnackbar(t('Employee.UpdateInfo.Success'), {
        variant: 'success',
      });
      queryClient.invalidateQueries(['staff', 'employees', id]);
    },
    onError: dispatchErrorDialog,
  });

  const handleFormSubmit = (values: UpdateEmployeeFormValues) => {
    const requestBody: UpdateEmployeeDto = {
      ...values,
      role: values.role.value,
    };

    updateEmployee(requestBody);
  };

  if (isLoadingEmployee) {
    return <CircularProgressBlock />;
  }

  return (
    <Box py={4}>
      <AdminDetailsViewHeader
        hrefBack={EMPLOYEES_STAFF_ROUTE}
        label='Chi tiết nhân viên'
      />

      <Card sx={{ p: 6 }}>
        <EmployeeForm
          employee={employee}
          setIsEditing={setIsEditingForm}
          isEditing={isEditingForm}
          isLoading={isUpdatingEmployee}
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
    'employee',
    'account',
    'common',
  ]);

  return { props: { ...locales } };
};
