import { Box, Card, Divider } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { Types } from 'mongoose';
import type { GetServerSideProps } from 'next';
import { useSnackbar } from 'notistack';
import type { ReactElement } from 'react';
import { useState } from 'react';

import type { UpdateProductInfoRb } from '../../api/admin/product/[id]';

import ProductController from 'api/controllers/Product.controller';
import { checkContextCredentials } from 'api/helpers/auth.helper';
import { serialize } from 'api/helpers/object.helper';
import type { ICdsUpeProduct, IProduct } from 'api/models/Product.model/types';
import type { JSendFailResponse } from 'api/types/response.type';
import { H5 } from 'components/abstract/Typography';
import AdminDetailsViewHeader from 'components/common/layout/header/AdminDetailsViewHeader';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import { getMessageList } from 'helpers/feedback.helper';
import { ProductForm } from 'pages-sections/admin';
import ImageListForm from 'pages-sections/admin/products/ImageListForm';
import ProductExpiration from 'pages-sections/admin/products/ProductExpiration';
import type { ProductInfoFormValues } from 'pages-sections/admin/products/ProductForm';
import apiCaller from 'utils/apiCallers/admin/product';

AdminProductDetails.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

interface EditProductProps {
  initialProduct: ICdsUpeProduct;
}

export default function AdminProductDetails({
  initialProduct,
}: EditProductProps) {
  const queryClient = useQueryClient();
  const { data: product } = useQuery({
    queryKey: ['product', initialProduct.id],
    queryFn: () => apiCaller.getProduct(initialProduct.id),
    initialData: initialProduct,
  });
  // console.log('file: [id].tsx:44 - EditProduct - product:', product);

  const initialValues: ProductInfoFormValues = {
    name: product.name,
    category: product.category,
    description: product.description,
    shelfLife: product.shelfLife,
    wholesalePrice: product.wholesalePrice,
    retailPrice: product.retailPrice,
    available: product.available,
  };

  const [isEditingForm, setIsEditingForm] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: updateProduct, isLoading } = useMutation<
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
        enqueueSnackbar(getMessageList(err.response.data.data), {
          variant: 'error',
        });
        return;
      }
      enqueueSnackbar('Đã có lỗi xảy ra, vui lòng thử lại sau', {
        variant: 'error',
      });
    },
  });

  const handleFormSubmit = (values: ProductInfoFormValues) => {
    const categoryId = values.category.id;
    const requestBody = {
      ...values,
      category: categoryId,
    };
    updateProduct(requestBody);
  };

  return (
    <Box py={4}>
      <AdminDetailsViewHeader
        hrefBack='/admin/product'
        label='Chi tiết sản phẩm'
      />

      <Card sx={{ p: 6 }}>
        <H5 mb={3}>Hình ảnh</H5>
        <ImageListForm images={product.imageUrls} />
        <Divider sx={{ mb: 4, borderColor: 'grey.400', mt: 4, mx: 6 }} />
        <H5 mb={5}>Thông tin</H5>
        <ProductForm
          setIsEditing={setIsEditingForm}
          isEditing={isEditingForm}
          isLoading={isLoading}
          initialValues={initialValues}
          handleFormSubmit={handleFormSubmit}
        />
      </Card>

      <ProductExpiration product={product} />
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

const newInitialValues: ProductInfoFormValues = {
  name: '',
  category: null,
  description: '',
  shelfLife: 0,
  wholesalePrice: 0,
  retailPrice: 0,
  available: true,
};
