import { Box, Card, Divider } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ProductController from 'api/controllers/Product.controller';
import { checkContextCredentials } from 'api/helpers/auth.helper';
import { serialize } from 'api/helpers/object.helper';
import type { ICdsUpeProduct, IProduct } from 'api/models/Product.model/types';
import type { JSendFailResponse } from 'api/types/response.type';
import type { AxiosError } from 'axios';
import { Types } from 'mongoose';
import type { GetServerSideProps } from 'next';
import { useSnackbar } from 'notistack';
import type { ReactElement } from 'react';
import { useReducer } from 'react';
import { useState } from 'react';

import type { UpdateProductInfoRb } from '../../api/admin/product/[id]';

import apiCaller from 'api-callers/admin/product';
import { H5 } from 'components/abstract/Typography';
import AdminDetailsViewHeader from 'components/common/layout/header/AdminDetailsViewHeader';
import { confirmDialogReducer } from 'components/dialog/confirm-dialog/reducer';
import { infoDialogReducer } from 'components/dialog/info-dialog/reducer';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import { getMessageList } from 'helpers/feedback.helper';
import { handleUpload } from 'helpers/imagekit.helper';
import { ProductForm } from 'pages-sections/admin';
import type { UploadSuccessResponse } from 'pages-sections/admin/products/ImageListForm';
import ImageListForm from 'pages-sections/admin/products/ImageListForm';
import ProductExpiration from 'pages-sections/admin/products/ProductExpiration';
import type { ProductInfoFormValues } from 'pages-sections/admin/products/ProductForm';

AdminProductDetails.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

interface EditProductProps {
  initialProduct: ICdsUpeProduct;
}

export default function AdminProductDetails({
  initialProduct,
}: EditProductProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [isUploadError, setIsUploadError] = useState(false);
  const [isEditingForm, setIsEditingForm] = useState(false);
  const [infoState, dispatchInfo] = useReducer(infoDialogReducer, {
    open: false,
  });

  const [confirmState, dispatchConfirm] = useReducer(confirmDialogReducer, {
    open: false,
  });

  const queryClient = useQueryClient();

  const { data: product } = useQuery({
    queryKey: ['product', initialProduct.id],
    queryFn: () => apiCaller.getProduct(initialProduct.id),
    initialData: initialProduct,
  });

  const { mutate: updateProductInfo, isLoading } = useMutation<
    IProduct,
    unknown,
    UpdateProductInfoRb
  >({
    mutationFn: (values) => apiCaller.updateProduct(product.id, values),
    onSuccess: () => {
      setIsEditingForm(false);
      enqueueSnackbar('Cập nhật sản phẩm thành công', { variant: 'success' });
      queryClient.invalidateQueries(['product', product.id]);
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

  const { mutate: pushProductImageUrls, isLoading: isPushingImageUrls } =
    useMutation<IProduct, unknown, string[]>({
      mutationFn: (imageUrls) => apiCaller.pushImageUrls(product.id, imageUrls),
      onSuccess: () => {
        enqueueSnackbar('Thêm ảnh sản phẩm thành công', {
          variant: 'success',
        });
        queryClient.refetchQueries(['product', product.id]);
      },
      onError: (err) => {
        console.log(err);
        enqueueSnackbar('Đã có lỗi xảy ra khi thêm ảnh sản phẩm', {
          variant: 'error',
        });
      },
    });

  const { mutate: deleteImageUrl, isLoading: isDeletingImageUrl } = useMutation<
    IProduct,
    unknown,
    string
  >({
    mutationFn: (imageUrl) => apiCaller.deleteImageUrl(product.id, imageUrl),
    onSuccess: () => {
      setIsUploadSuccess(true);
      setIsUploadError(false);

      enqueueSnackbar('Xoá ảnh đã chọn thành công', {
        variant: 'success',
      });
      queryClient.refetchQueries(['product', product.id]);
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

  const handleInfoFormSubmit = (values: ProductInfoFormValues) => {
    const categoryId = values.category.id;
    const requestBody = {
      ...values,
      category: categoryId,
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

  return (
    <Box py={4}>
      <AdminDetailsViewHeader
        hrefBack='/admin/product'
        label='Chi tiết sản phẩm'
      />

      <Card sx={{ p: 6 }}>
        <H5 mb={3}>Hình ảnh</H5>
        <ImageListForm
          confirmState={confirmState}
          dispatchConfirm={dispatchConfirm}
          imageUrls={product.imageUrls}
          onFilesSelected={handleUpload.bind(null, {
            onUploadError,
            onUploadStart,
            onUploadSuccess,
            folderName: `products/${product.category.slug}/${product.slug}`,
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

      <ProductExpiration product={product} />
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { isNotAuthorized, blockingResult } =
    await checkContextCredentials(context);
  if (isNotAuthorized) return blockingResult;

  const isValidId = Types.ObjectId.isValid(context.params.id as string);
  if (!isValidId) {
    return {
      notFound: true,
    };
  }

  // FIXME could move this to client as well to improve load time, but have to implement loading indicator
  const product = (await ProductController.getOne({
    id: context.params.id as string,
    populate: ['category', 'defaultSupplier'],
  })) as unknown as ICdsUpeProduct;

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: { initialProduct: serialize(product) },
  };
};
