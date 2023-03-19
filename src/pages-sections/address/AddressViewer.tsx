import { Delete, Edit, Place } from '@mui/icons-material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import {
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { GetStaticProps, NextPage } from 'next';
import { useSnackbar } from 'notistack';
import { useReducer, useState } from 'react';

import type { IAccountAddress } from 'api/models/Account.model/AccountAddress.schema/types';
import UserDashboardHeader from 'components/common/layout/header/UserDashboardHeader';
import TableRow from 'components/data-table/TableRow';
import ConfirmDialog from 'components/dialog/confirm-dialog';
import { confirmDialogReducer } from 'components/dialog/confirm-dialog/reducer';
import { FlexRowCenter } from 'components/flex-box';
import CustomerDashboardNavigation from 'components/layouts/customer-dashboard/Navigations';
import { getFullAddress } from 'helpers/address.helper';
import api from 'utils/__api__/address';
import apiCaller from 'utils/apiCallers/address';

type AddressViewerProps = {
  isLoading: boolean;
  accountId: string;
  addresses: IAccountAddress[];
  setIsAddMode: (isAddMode: boolean) => void;
  setEditingAddress: (info: IAccountAddress) => void;
};

const AddressViewer: NextPage<AddressViewerProps> = ({
  isLoading,
  accountId,
  addresses,
  setIsAddMode,
  setEditingAddress,
}) => {
  const [state, dispatch] = useReducer(confirmDialogReducer, {
    open: false,
  });
  const { enqueueSnackbar } = useSnackbar();

  const [deleteAddressId, setDeleteAddressId] = useState<string>();

  const queryClient = useQueryClient();

  const { mutate: deleteAddress } = useMutation<
    IAccountAddress[],
    unknown,
    string
  >({
    mutationFn: (addressId) =>
      apiCaller.deleteAddress(accountId, { addressId }),
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

  const { mutate: setDefaultAddress } = useMutation<
    IAccountAddress[],
    unknown,
    string
  >({
    mutationFn: (addressId) =>
      apiCaller.setDefaultAddress(accountId, addressId),
    onSuccess: (newAddresses) => {
      enqueueSnackbar('Đặt làm địa chỉ mặc định thành công', {
        variant: 'success',
      });
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

  const HEADER_BUTTON = (
    <Button
      color='primary'
      sx={{ bgcolor: 'primary.light', px: 4 }}
      onClick={() => setIsAddMode(true)}
    >
      Thêm địa chỉ
    </Button>
  );

  const handleSetDefaultAddressRequest = (address: IAccountAddress) => {
    if (address.isDefault) return;
    setDefaultAddress(address.id);
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
              {getFullAddress(address)}
            </Typography>

            <Typography whiteSpace='pre' textAlign='center' color='grey.600'>
              <IconButton
                color={address.isDefault ? 'primary' : 'inherit'}
                onClick={() => {
                  handleSetDefaultAddressRequest(address);
                }}
              >
                <LocalShippingIcon fontSize='small' color='inherit' />
              </IconButton>

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
          deleteAddress(deleteAddressId);
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

export const getStaticProps: GetStaticProps = async () => {
  const addressList = await api.getAddressList();
  return { props: { addressList } };
};

export default AddressViewer;
