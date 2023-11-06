import { Box, Card } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';
import type { ReactElement } from 'react';
import { useReducer } from 'react';
import { useState } from 'react';

import staffEmployeeCaller from 'api-callers/staff/employees';
import type {
  NewEmployeeDto,
  NewEmployeeFormValues,
} from 'backend/dtos/employees/NewEmployee.dto';
import type { CommonEmployeeModel } from 'backend/services/employee/helper';
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

AdminEmployeeCreate.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

export default function AdminEmployeeCreate() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [infoState, dispatchInfo] = useReducer(
    infoDialogReducer,
    initInfoDialogState,
  );

  const { t } = useCustomTranslation(['employee', 'account']);
  const { ErrorDialog, dispatchErrorDialog } = useServerSideErrorDialog({
    t,
    operationName: 'Thêm nhân viên',
  });

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { mutate: createEmployee, isLoading } = useMutation<
    CommonEmployeeModel,
    unknown,
    NewEmployeeDto
  >({
    mutationFn: async (requestBody) =>
      staffEmployeeCaller.createEmployee(requestBody),
    onSuccess: () => {
      enqueueSnackbar(t('Employee.AddInfo.Success'), {
        variant: 'success',
      });

      setIsRedirecting(true);
      router.push(EMPLOYEES_STAFF_ROUTE);
    },
    onError: dispatchErrorDialog,
  });

  const handleFormSubmit = (values: NewEmployeeFormValues) => {
    const requestBody: NewEmployeeDto = {
      ...values,
      role: values.role.value,
    };

    createEmployee(requestBody);
  };

  return (
    <Box py={4}>
      <AdminDetailsViewHeader
        hrefBack={EMPLOYEES_STAFF_ROUTE}
        label='Thêm nhân viên'
      />

      <Card sx={{ p: 6 }}>
        <EmployeeForm
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
    'employee',
    'account',
    'common',
  ]);

  return { props: { ...locales } };
};
