import { Box, Card, Divider } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { checkContextCredentials } from 'api/helpers/auth.helper';
import type { IPopulatedCategoryProduct } from 'api/models/Product.model/types';
import type { JSendFailResponse } from 'api/types/response.type';
import type { AxiosError } from 'axios';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { useReducer } from 'react';
import { useState } from 'react';

import type { CreateProductRb } from '../../api/admin/product/create';

import apiCaller from 'api-callers/admin/product';
import { H5 } from 'components/abstract/Typography';
import AdminDetailsViewHeader from 'components/common/layout/header/AdminDetailsViewHeader';
import { confirmDialogReducer } from 'components/dialog/confirm-dialog/reducer';
import { infoDialogReducer } from 'components/dialog/info-dialog/reducer';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import { getMessageList } from 'helpers/feedback.helper';
import { handleUpload } from 'helpers/imagekit.helper';
import type { UploadSuccessResponse } from 'pages-sections/admin/products/ImageListForm';
import ImageListForm from 'pages-sections/admin/products/ImageListForm';
import type { ProductInfoFormValues } from 'pages-sections/admin/products/ProductForm';
import ProductForm from 'pages-sections/admin/products/ProductForm';

AdminProductCreate.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

export default function AdminProductCreate() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploadingImages, setIsUploadingImage] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const onUploadStart = () => {
    setIsUploadingImage(true);
  };

  const onUploadSuccess = (
    response: UploadSuccessResponse[],
    context: Record<string, any>,
  ) => {
    setIsUploadingImage(false);
    const newImageUrls = response.map(
      (item) => `${item.url}?updatedAt=${Date.now()}`,
    );
    console.log(
      'file: create.tsx:54 - apiCaller.pushImageUrls - context.productId:',
      context.productId,
    );

    setIsRedirecting(true);
    // Step 3: Push ImageKit product urls back to Product
    apiCaller
      .pushImageUrls(context.productId, newImageUrls)
      .then((res) => {
        enqueueSnackbar(
          'Tải ảnh lên thành công! Đang chuyển hướng về trang quản lý sản phẩm...',
          {
            variant: 'success',
          },
        );

        router.push('/admin/product');
      })
      .catch((err) => {
        console.log(err);
        setIsRedirecting(false);
        enqueueSnackbar(
          'Đã có lỗi xảy ra trong quá trình thêm ảnh vào sản phẩm',
          {
            variant: 'error',
          },
        );
      });
  };

  const onUploadError = (err: any) => {
    console.log(err);
    setIsUploadingImage(false);
  };

  const [infoState, dispatchInfo] = useReducer(infoDialogReducer, {
    open: false,
  });

  const [confirmState, dispatchConfirm] = useReducer(confirmDialogReducer, {
    open: false,
  });

  const imageUrls = useMemo(() => {
    return selectedFiles.map((file) => URL.createObjectURL(file));
  }, [selectedFiles]);

  const [submissionClicked, setSubmissionClicked] = useState(false);
  const hasUploadError = useMemo(
    () => imageUrls.length === 0 && submissionClicked,
    [imageUrls, submissionClicked],
  );

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { mutate: createProductInfo, isLoading: isAddingProduct } = useMutation<
    IPopulatedCategoryProduct,
    AxiosError<JSendFailResponse<any>>,
    CreateProductRb
  >({
    mutationFn: (requestBody) => apiCaller.createProduct(requestBody),
    onSuccess: async (product) => {
      enqueueSnackbar(
        'Thêm thông tin sản phẩm thành công! Tiến hành tải ảnh...',
        {
          variant: 'success',
        },
      );
      console.log('Thêm thông tin sản phẩm thành công! Tiến hành tải ảnh...');
      console.log('file: create.tsx:102 - onSuccess: - product:', product);

      // Step 2: Upload product images to ImageKit
      try {
        await handleUpload(
          {
            onUploadError,
            onUploadStart,
            onUploadSuccess,
            folderName: `products/${product.category.slug}/${product.slug}`,
            context: {
              productId: product.id,
            },
          },
          selectedFiles,
        );
      } catch (err) {
        console.log(
          'Đã có lỗi xảy ra khi upload ảnh sản phẩm, thông tin sản phẩm đã được lưu',
          err,
        );
        enqueueSnackbar(
          'Đã có lỗi xảy ra khi upload ảnh sản phẩm, thông tin sản phẩm đã được lưu',
          {
            variant: 'error',
          },
        );
      }
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

  const handleFormSubmit = (values: ProductInfoFormValues) => {
    setSubmissionClicked(true);
    if (hasUploadError) {
      return;
    }

    const categoryId = values.category.id;
    const requestBody = {
      ...values,
      category: categoryId,
    };

    console.log(requestBody);
    console.log(selectedFiles);
    // Step 1: Create product info
    createProductInfo(requestBody);
  };

  return (
    <Box py={4}>
      <AdminDetailsViewHeader hrefBack='/admin/product' label='Thêm sản phẩm' />

      <Card sx={{ p: 6 }}>
        <H5 mb={3}>Hình ảnh</H5>
        <ImageListForm
          hasError={hasUploadError}
          confirmState={confirmState}
          dispatchConfirm={dispatchConfirm}
          imageUrls={imageUrls}
          onFilesSelected={setSelectedFiles}
          onFileDeleted={(_, index) => {
            setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
            dispatchConfirm({
              type: 'confirm_dialog',
            });
          }}
        />
        <Divider sx={{ mb: 4, borderColor: 'grey.400', mt: 4, mx: 6 }} />
        <H5 mb={5}>Thông tin</H5>
        <ProductForm
          setSubmissionClicked={setSubmissionClicked}
          isEditing
          isLoading={isAddingProduct || isUploadingImages || isRedirecting}
          handleFormSubmit={handleFormSubmit}
          infoState={infoState}
          dispatchInfo={dispatchInfo}
        />
      </Card>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { isNotAuthorized, blockingResult } =
    await checkContextCredentials(context);
  if (isNotAuthorized) return blockingResult;

  return {
    props: {},
  };
};
