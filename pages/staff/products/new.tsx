import { Box, Card, Divider } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { useReducer } from 'react';
import { useState } from 'react';

import apiCaller from 'api-callers/staff/products';
import type {
  NewProductDto,
  ProductFormValues,
} from 'backend/dtos/product/newProduct.dto';
import type { ExtendedCommonProductModel } from 'backend/services/product/helper';
import { H5 } from 'components/abstract/Typography';
import AdminDetailsViewHeader from 'components/common/layout/header/AdminDetailsViewHeader';
import {
  confirmDialogReducer,
  initConfirmDialogState,
} from 'components/dialog/confirm-dialog/reducer';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import { PRODUCTS_STAFF_ROUTE } from 'constants/routes.ui.constant';
import type { AxiosErrorWithMessages } from 'helpers/error.helper';
import { handleUpload } from 'helpers/imagekit.helper';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import { useServerSideErrorDialog } from 'hooks/useServerErrorDialog';
import type { UploadSuccessResponse } from 'pages-sections/staff/products/ImageListForm';
import ImageListForm from 'pages-sections/staff/products/ImageListForm';
import ProductForm from 'pages-sections/staff/products/ProductForm';
import { getSlug } from 'utils/string.helper';

AdminProductCreate.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

export default function AdminProductCreate() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploadingImages, setIsUploadingImage] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { t } = useCustomTranslation(['product']);
  const { ErrorDialog, dispatchErrorDialog } = useServerSideErrorDialog({
    t,
    operationName: 'Thêm sản phẩm',
  });

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
      .pushImages(context.productId, newImageUrls)
      .then(() => {
        enqueueSnackbar(
          'Tải ảnh lên thành công! Đang chuyển hướng về trang quản lý sản phẩm...',
          {
            variant: 'success',
          },
        );

        router.push(PRODUCTS_STAFF_ROUTE);
      })
      .catch((err) => {
        console.log(err);
        setIsRedirecting(false);
        enqueueSnackbar(
          'Đã có lỗi xảy ra trong quá trình thêm ảnh vào sản phẩm (ảnh đã được tải lên)',
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

  const [confirmState, dispatchConfirm] = useReducer(
    confirmDialogReducer,
    initConfirmDialogState,
  );

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
    ExtendedCommonProductModel,
    AxiosErrorWithMessages,
    NewProductDto
  >({
    mutationFn: (requestBody) => apiCaller.createProduct(requestBody),
    onSuccess: async (product) => {
      enqueueSnackbar(t('Product.AddInfo.Success'), {
        variant: 'success',
      });
      console.log('Thêm thông tin sản phẩm thành công! Tiến hành tải ảnh...');
      console.log('file: create.tsx:102 - onSuccess: - product:', product);
      const folderName = `products/${getSlug(
        product.productCategory,
      )}/${getSlug(product)}`;
      // Step 2: Upload product images to ImageKit
      try {
        await handleUpload(
          {
            onUploadError,
            onUploadStart,
            onUploadSuccess,
            folderName,
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
        enqueueSnackbar(t('Product.AddImages.Failed'), {
          variant: 'error',
        });
      }
    },
    onError: dispatchErrorDialog,
  });

  const handleFormSubmit = (values: ProductFormValues) => {
    setSubmissionClicked(true);
    if (hasUploadError) {
      return;
    }

    const categoryId = values.productCategory.id;
    const requestBody: NewProductDto = {
      ...values,
      productCategory: categoryId,
    };

    console.log(requestBody);
    console.log(selectedFiles);
    // Step 1: Create product info
    createProductInfo(requestBody);
  };

  return (
    <Box py={4}>
      <AdminDetailsViewHeader
        hrefBack={PRODUCTS_STAFF_ROUTE}
        label='Thêm sản phẩm'
      />

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
          t={t}
        />
        <ErrorDialog />
      </Card>
    </Box>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const locales = await serverSideTranslations(locale ?? 'vn', [
    'product',
    'common',
  ]);

  return { props: { ...locales } };
};
