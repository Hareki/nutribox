import { Box } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { Types } from 'mongoose';
import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useSnackbar } from 'notistack';
import type { ReactElement } from 'react';
import { useState } from 'react';
import * as yup from 'yup';

import type { UpdateProductInfoRb } from '../../api/admin/product/[id]';
import { authOptions } from '../../api/auth/[...nextauth]';

import ProductController from 'api/controllers/Product.controller';
import { serialize } from 'api/helpers/object.helper';
import type {
  IPopulatedCategoryProduct,
  IProduct,
} from 'api/models/Product.model/types';
import type { JSendFailResponse } from 'api/types/response.type';
import AdminDetailsViewHeader from 'components/common/layout/header/AdminDetailsViewHeader';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import { getMessageList } from 'helpers/feedback.helper';
import { ProductForm } from 'pages-sections/admin';
import type { ProductInfoFormValues } from 'pages-sections/admin/products/ProductForm';
import apiCaller from 'utils/apiCallers/admin/product';

EditProduct.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

interface EditProductProps {
  initialProduct: IPopulatedCategoryProduct;
}

export default function EditProduct({ initialProduct }: EditProductProps) {
  const queryClient = useQueryClient();
  const { data: product } = useQuery({
    queryKey: ['product', initialProduct.id],
    queryFn: () => apiCaller.getProduct(initialProduct.id),
    initialData: initialProduct,
  });

  const initialValues: ProductInfoFormValues = {
    name: product.name,
    category: product.category,
    description: product.description,
    shelfLife: product.shelfLife,
    wholesalePrice: product.wholesalePrice,
    retailPrice: product.retailPrice,
  };

  const [isEditing, setIsEditing] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: updateProduct, isLoading } = useMutation<
    IProduct,
    unknown,
    UpdateProductInfoRb
  >({
    mutationFn: (values) => apiCaller.updateProduct(product.id, values),
    onSuccess: () => {
      setIsEditing(false);
      enqueueSnackbar('Cập nhật sản phẩm thành công', { variant: 'success' });
      queryClient.invalidateQueries(['product', product.id]);
    },
    // FIXME onError bị lặp giữa các useMutation
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
        label='Thông tin sản phẩm'
      />

      <ProductForm
        setIsEditing={setIsEditing}
        isEditing={isEditing}
        isLoading={isLoading}
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
      />
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
    populate: ['category'],
  })) as unknown as IPopulatedCategoryProduct;

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

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Vui lòng nhập tên sản phẩm')
    .max(100, 'Tên sản phẩm không được quá 100 ký tự'),
  category: yup
    .object()
    .typeError('Vui lòng chọn danh mục')
    .required('Vui lòng chọn danh mục'),
  description: yup
    .string()
    .required('Vui lòng nhập mô tả sản phẩm')
    .max(500, 'Mô tả sản phẩm không được quá 500 ký tự'),
  shelfLife: yup
    .number()
    .required('Vui lòng số ngày sử dụng')
    .min(1, 'Số ngày sử dụng phải lớn hơn 0'),
  wholesalePrice: yup
    .number()
    .required('Vui lòng nhập giá gốc')
    .min(1, 'Giá gốc phải lớn hơn 0'),
  retailPrice: yup
    .number()
    .required('Vui lòng nhập giá bán')
    .min(1, 'Giá bán phải lớn hơn 0')
    .test(
      'retailPrice-greater-than-wholesalePrice',
      'Giá bán phải lớn hơn giá gốc',
      function (value) {
        const { wholesalePrice } = this.parent;
        return value && value > wholesalePrice;
      },
    ),
});
