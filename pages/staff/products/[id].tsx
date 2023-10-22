import { Box, Card, Divider } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';
import type { ReactElement } from 'react';
import { useMemo, useReducer } from 'react';
import { useState } from 'react';

import apiCaller from 'api-callers/staff/products';
import type { ProductFormValues } from 'backend/dtos/product/newProduct.dto';
import type { UpdateProductDto } from 'backend/dtos/product/updateProduct.dto';
import type { CommonProductModel } from 'backend/services/product/helper';
import type { JSFail } from 'backend/types/jsend';
import { H5 } from 'components/abstract/Typography';
import CircularProgressBlock from 'components/common/CircularProgressBlock';
import AdminDetailsViewHeader from 'components/common/layout/header/AdminDetailsViewHeader';
import {
  confirmDialogReducer,
  initConfirmDialogState,
} from 'components/dialog/confirm-dialog/reducer';
import {
  infoDialogReducer,
  initInfoDialogState,
} from 'components/dialog/info-dialog/reducer';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import { PRODUCTS_STAFF_ROUTE } from 'constants/routes.ui.constant';
import { getMessageList } from 'helpers/feedback.helper';
import { handleUpload } from 'helpers/imagekit.helper';
import type { ProductModel } from 'models/product.model';
import { ProductForm } from 'pages-sections/admin';
import type { UploadSuccessResponse } from 'pages-sections/admin/products/ImageListForm';
import ImageListForm from 'pages-sections/admin/products/ImageListForm';
import ProductExpiration from 'pages-sections/admin/products/ProductExpiration';
import { getSlug } from 'utils/string.helper';

AdminProductDetails.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

export default function AdminProductDetails() {
  const { enqueueSnackbar } = useSnackbar();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [, setIsUploadSuccess] = useState(false);
  const [, setIsUploadError] = useState(false);
  const [isEditingForm, setIsEditingForm] = useState(false);
  const [infoState, dispatchInfo] = useReducer(
    infoDialogReducer,
    initInfoDialogState,
  );

  const router = useRouter();
  const productId = router.query.id as string;

  const [confirmState, dispatchConfirm] = useReducer(
    confirmDialogReducer,
    initConfirmDialogState,
  );

  const queryClient = useQueryClient();

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['products', productId],
    queryFn: () => apiCaller.getProduct(productId),
  });

  const { mutate: updateProductInfo, isLoading } = useMutation<
    ProductModel,
    unknown,
    UpdateProductDto
  >({
    mutationFn: (values) => apiCaller.updateProduct(productId, values),
    onSuccess: (res) => {
      setIsEditingForm(false);
      enqueueSnackbar('Cập nhật sản phẩm thành công', { variant: 'success' });
      queryClient.invalidateQueries(['product', productId]);
      queryClient.setQueryData(['product', productId], res);
    },
    onError: (err: AxiosError<JSFail<any>>) => {
      console.log(err);
      if (err.response?.data.data) {
        dispatchInfo({
          type: 'open_dialog',
          payload: {
            title: 'Có lỗi xảy ra',
            // FIXME
            content: getMessageList(err.response.data.data as any),
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

  const { mutate: pushProductImageUrls, isLoading: isPushingImageUrls } =
    useMutation<CommonProductModel, unknown, string[]>({
      mutationFn: (imageUrls) => apiCaller.pushImages(productId, imageUrls),
      onSuccess: () => {
        enqueueSnackbar('Thêm ảnh sản phẩm thành công', {
          variant: 'success',
        });
        queryClient.refetchQueries(['product', productId]);
      },
      onError: (err) => {
        console.log(err);
        enqueueSnackbar('Đã có lỗi xảy ra khi thêm ảnh sản phẩm', {
          variant: 'error',
        });
      },
    });

  const { mutate: deleteImageUrl, isLoading: isDeletingImageUrl } = useMutation<
    CommonProductModel,
    unknown,
    string
  >({
    mutationFn: (imageUrl) => apiCaller.removeImage(productId, imageUrl),
    onSuccess: () => {
      setIsUploadSuccess(true);
      setIsUploadError(false);

      enqueueSnackbar('Xoá ảnh đã chọn thành công', {
        variant: 'success',
      });
      queryClient.refetchQueries(['product', productId]);
    },
    onError: (err) => {
      setIsUploadSuccess(false);
      setIsUploadError(true);

      console.log(err);
      enqueueSnackbar('Đã có lỗi xảy ra khi xoá ảnh đã chọn', {
        variant: 'error',
      });
    },
  });

  const handleInfoFormSubmit = (values: ProductFormValues) => {
    const categoryId = values.productCategory.id;
    const requestBody: UpdateProductDto = {
      ...values,
      productCategory: categoryId,
    };
    updateProductInfo(requestBody);
  };

  const onUploadStart = () => {
    setIsUploadingImage(true);
  };

  const onUploadSuccess = (response: UploadSuccessResponse[]) => {
    setIsUploadingImage(false);

    const newImageUrls = response.map(
      (item) => `${item.url}?updatedAt=${Date.now()}`,
    );

    pushProductImageUrls(newImageUrls);
  };

  const onUploadError = (err: any) => {
    console.log(err);
    setIsUploadingImage(false);
  };

  const imageUrls = useMemo(() => {
    return product?.productImages.map((item) => item.imageUrl);
  }, [product]);

  if (isLoadingProduct) return <CircularProgressBlock />;

  return (
    <Box py={4}>
      <AdminDetailsViewHeader
        hrefBack={PRODUCTS_STAFF_ROUTE}
        label='Chi tiết sản phẩm'
      />

      <Card sx={{ p: 6 }}>
        <H5 mb={3}>Hình ảnh</H5>
        <ImageListForm
          confirmState={confirmState}
          dispatchConfirm={dispatchConfirm}
          imageUrls={imageUrls!}
          onFilesSelected={handleUpload.bind(null, {
            onUploadError,
            onUploadStart,
            onUploadSuccess,
            folderName: `products/${getSlug(
              product?.productCategory,
            )}/${getSlug(product)}`,
          })}
          onFileDeleted={(url) => deleteImageUrl(url)}
          isAddingImageUrls={isUploadingImage || isPushingImageUrls}
          isDeletingImageUrl={isDeletingImageUrl}
        />
        <Divider sx={{ mb: 4, borderColor: 'grey.400', mt: 4, mx: 6 }} />
        <H5 mb={5}>Thông tin</H5>
        <ProductForm
          setIsEditing={setIsEditingForm}
          isEditing={isEditingForm}
          isLoading={isLoading}
          product={product}
          infoState={infoState}
          dispatchInfo={dispatchInfo}
          handleFormSubmit={handleInfoFormSubmit}
        />
      </Card>

      <ProductExpiration product={product!} />
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const locales = await serverSideTranslations(locale ?? 'vn', [
    'product',
    'importOrder',
  ]);

  return { props: { ...locales } };
};
