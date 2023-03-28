import { Box, Card, Divider } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AxiosError } from 'axios';
import { Types } from 'mongoose';
import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useSnackbar } from 'notistack';
import type { ReactElement } from 'react';
import { useState } from 'react';

import type { UpdateProductInfoRb } from '../../api/admin/product/[id]';
import { authOptions } from '../../api/auth/[...nextauth]';

import ProductController from 'api/controllers/Product.controller';
import { serialize } from 'api/helpers/object.helper';
import type { ICdsUpeProduct, IProduct } from 'api/models/Product.model/types';
import type { JSendFailResponse } from 'api/types/response.type';
import AdminDetailsViewHeader from 'components/common/layout/header/AdminDetailsViewHeader';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import { getMessageList } from 'helpers/feedback.helper';
import { ProductForm } from 'pages-sections/admin';
import ProductExpiration from 'pages-sections/admin/products/ProductExpiration';
import type { ProductInfoFormValues } from 'pages-sections/admin/products/ProductForm';
import apiCaller from 'utils/apiCallers/admin/product';

EditProduct.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

interface EditProductProps {
  initialProduct: ICdsUpeProduct;
}

export default function EditProduct({ initialProduct }: EditProductProps) {
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
        {/* <h3>Thông tin sản phẩm</h3> */}
        <Divider sx={{ mb: 5, borderColor: 'grey.400', mt: 3, mx: 6 }} />
        <ProductForm
          setIsEditing={setIsEditingForm}
          isEditing={isEditingForm}
          isLoading={isLoading}
          initialValues={initialValues}
          handleFormSubmit={handleFormSubmit}
        />
      </Card>

      <ProductExpiration product={product} />
      <ReactQueryDevtools />
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const isValidId = Types.ObjectId.isValid(context.params.id as string);
  if (!isValidId) {
    return {
      notFound: true,
    };
  }

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
};
