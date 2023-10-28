import { Delete, Edit, Place } from '@mui/icons-material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import {
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import type { FC } from 'react';
import { useReducer, useState } from 'react';

import addressCaller from 'api-callers/profile/addresses';
import UserDashboardHeader from 'components/common/layout/header/UserDashboardHeader';
import TableRow from 'components/data-table/TableRow';
import ConfirmDialog from 'components/dialog/confirm-dialog';
import {
  confirmDialogReducer,
  initConfirmDialogState,
} from 'components/dialog/confirm-dialog/reducer';
import { FlexBox, FlexRowCenter } from 'components/flex-box';
import CustomerDashboardNavigation from 'components/layouts/customer-dashboard/Navigations';
import { getFullAddressFromNames } from 'helpers/address.helper';
import type { CustomerAddressModel } from 'models/customerAddress.model';

type AddressViewerProps = {
  isLoading: boolean;
  accountId: string;
  addresses: CustomerAddressModel[];
  setIsAddMode: (isAddMode: boolean) => void;
  setEditingAddress: (info: CustomerAddressModel) => void;
};

const AddressViewer: FC<AddressViewerProps> = ({
  isLoading,
  accountId,
  addresses,
  setIsAddMode,
  setEditingAddress,
}) => {
  const [state, dispatch] = useReducer(
    confirmDialogReducer,
    initConfirmDialogState,
  );
  const { enqueueSnackbar } = useSnackbar();

  const [deleteAddressId, setDeleteAddressId] = useState<string>();

  const queryClient = useQueryClient();

  const { mutate: deleteAddress } = useMutation<
    CustomerAddressModel[],
    unknown,
    string
  >({
    mutationFn: (addressId) => addressCaller.deleteAddress(addressId),
    onSuccess: (newAddresses) => {
      enqueueSnackbar('Xoá địa chỉ đã chọn thành công', { variant: 'success' });
      queryClient.invalidateQueries(['addresses', accountId]);
      queryClient.setQueryData(['addresses', accountId], newAddresses);
    },
    onError: (err) => {
      console.log(err);
      enqueueSnackbar('Đã có lỗi xảy ra, vui lòng thử lại sau', {
        variant: 'error',
      });
    },
  });

  const { mutate: setDefaultAddress, isLoading: isSettingDefault } =
    useMutation<CustomerAddressModel[], unknown, CustomerAddressModel>({
      mutationFn: ({ id, ...address }) =>
        addressCaller.setDefaultAddress(id, {
          ...address,
          isDefault: true,
        }),
      onSuccess: (newAddresses) => {
        enqueueSnackbar('Đặt làm địa chỉ mặc định thành công', {
          variant: 'success',
        });
        queryClient.invalidateQueries(['addresses', accountId]);
        queryClient.setQueryData(['addresses', accountId], newAddresses);
        console.log('file: AddressViewer.tsx:86 - accountId:', accountId);
        console.log('file: AddressViewer.tsx:88 - newAddresses:', newAddresses);
      },
      onError: (err) => {
        console.log(err);
        enqueueSnackbar('Đã có lỗi xảy ra, vui lòng thử lại sau', {
          variant: 'error',
        });
      },
    });

  const HEADER_BUTTON = (
    <Button
      color='primary'
      sx={{ bgcolor: 'primary.light', px: 4 }}
      onClick={() => setIsAddMode(true)}
    >
      Thêm địa chỉ
    </Button>
  );

  const handleSetDefaultAddressRequest = (address: CustomerAddressModel) => {
    if (address.isDefault) return;
    setDefaultAddress(address);
  };

  const handleAddressDeleteRequest = (id: string) => {
    setDeleteAddressId(id);
    dispatch({
      type: 'open_dialog',
      payload: {
        title: 'Xoá địa chỉ đã chọn?',
        content:
          'Bạn có chắc muốn xoá địa chỉ này? Hành động này không thể hoàn tác',
      },
    });
  };

  return (
    <>
      <UserDashboardHeader
        icon={Place}
        title='Địa chỉ'
        button={HEADER_BUTTON}
        navigation={<CustomerDashboardNavigation />}
      />

      {!isLoading ? (
        addresses.map((address) => (
          <TableRow sx={{ my: 2, padding: '6px 18px' }} key={address.id}>
            <Typography whiteSpace='pre' m={0.75} textAlign='left'>
              {address.title}
            </Typography>

            <Typography flex='1 1 260px !important' m={0.75} textAlign='left'>
              {getFullAddressFromNames(address)}
            </Typography>

            <Typography whiteSpace='pre' textAlign='center' color='grey.600'>
              <FlexBox alignItems='center' justifyContent='flex-end'>
                {isSettingDefault ? (
                  <CircularProgress size={20} />
                ) : (
                  <IconButton
                    color={address.isDefault ? 'primary' : 'inherit'}
                    onClick={() => {
                      handleSetDefaultAddressRequest(address);
                    }}
                  >
                    <LocalShippingIcon fontSize='small' color='inherit' />
                  </IconButton>
                )}

                <IconButton
                  onClick={() => {
                    setEditingAddress(address);
                  }}
                >
                  <Edit fontSize='small' color='inherit' />
                </IconButton>

                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddressDeleteRequest(address.id);
                  }}
                >
                  <Delete fontSize='small' color='inherit' />
                </IconButton>
              </FlexBox>
            </Typography>
          </TableRow>
        ))
      ) : (
        <FlexRowCenter>
          <CircularProgress />
        </FlexRowCenter>
      )}

      <ConfirmDialog
        open={state.open}
        handleConfirm={() => {
          console.log('confirm');
          deleteAddress(deleteAddressId!);
          dispatch({ type: 'confirm_dialog' });
        }}
        handleCancel={() => {
          console.log('cancel');
          dispatch({ type: 'cancel_dialog' });
        }}
        title={state.title}
        content={state.content}
      />
    </>
  );
};

export default AddressViewer;
