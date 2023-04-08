import { Add } from '@mui/icons-material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { LoadingButton } from '@mui/lab';
import { Box, ImageListItemBar, useTheme } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { Fragment, useReducer, useRef, useState } from 'react';
import { Gallery, Item as GalleryItem } from 'react-photoswipe-gallery';

import type { IProduct } from 'api/models/Product.model/types';
import type { IProductCategory } from 'api/models/ProductCategory.model/types';
import { Paragraph } from 'components/abstract/Typography';
import UploadMultipleFilesInput from 'components/common/input/UploadMultipleFilesInput';
import ConfirmDialog from 'components/dialog/confirm-dialog';
import { confirmDialogReducer } from 'components/dialog/confirm-dialog/reducer';
import { FlexBox } from 'components/flex-box';
import apiCaller from 'utils/apiCallers/admin/product';
import 'photoswipe/dist/photoswipe.css';

interface UploadSuccessResponse {
  url: string;
}
interface ImageListFormProps {
  product: {
    id: string;
    imageUrls: string[];
    slug: string;
    category: IProductCategory;
  };
}
const ImageListForm = ({ product }: ImageListFormProps) => {
  const images = product.imageUrls || [];
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { palette } = useTheme();
  const [selectedUrl, setSelectedUrl] = useState('');
  const uploadRef = useRef<HTMLInputElement>();

  const [confirmState, dispatchConfirm] = useReducer(confirmDialogReducer, {
    open: false,
  });

  const { mutate: pushImageUrls, isLoading: isPushingImageUrls } = useMutation<
    IProduct,
    unknown,
    string[]
  >({
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
      dispatchConfirm({ type: 'confirm_dialog' });
      enqueueSnackbar('Xoá ảnh đã chọn thành công', {
        variant: 'success',
      });
      queryClient.refetchQueries(['product', product.id]);
    },
    onError: (err) => {
      dispatchConfirm({ type: 'cancel_dialog' });
      console.log(err);
      enqueueSnackbar('Đã có lỗi xảy ra khi xoá ảnh đã chọn', {
        variant: 'error',
      });
    },
  });

  const onUploadStart = () => {
    setIsUploadingImage(true);
  };

  const onUploadSuccess = (response: UploadSuccessResponse[]) => {
    console.log(
      'file: ImageListForm.tsx:36 - onUploadSuccess - response:',
      response,
    );

    setIsUploadingImage(false);

    const newImageUrls = response.map(
      (item) => `${item.url}?updatedAt=${Date.now()}`,
      // (item) => item.url,
    );

    pushImageUrls(newImageUrls);
  };

  const onUploadError = (err: any) => {
    console.log(err);
    setIsUploadingImage(false);
  };

  return (
    <Fragment>
      <ImageList sx={{ maxHeight: 300 }} cols={2} rowHeight={300}>
        <Gallery>
          {images.map((item, index) => (
            <ImageListItem
              key={item}
              sx={{ position: 'relative', display: 'flex' }}
            >
              <GalleryItem
                original={item}
                thumbnail={item}
                alt={`Image ${index}`}
                width='1024'
                height='768'
              >
                {({ ref, open }) => (
                  <Fragment>
                    <img
                      // quality={100}
                      src={item}
                      // fill
                      alt={`Image ${index}`}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        objectFit: 'contain',
                        cursor: 'pointer',
                        // maxHeight: '200px',
                        // height: '100%',
                        width: '100%',
                        maxWidth: '300px',
                      }}
                      // maxHeight='200'
                      // width='266.67'
                      ref={ref as React.MutableRefObject<HTMLImageElement>}
                      onClick={open}
                    />
                    <ImageListItemBar
                      sx={{
                        background: 'transparent',
                      }}
                      position='top'
                      actionIcon={
                        // <IconButton sx={{ color: palette.grey[700] }}>
                        //   <DeleteForeverOutlinedIcon />
                        // </IconButton>
                        <LoadingButton
                          loading={isDeletingImageUrl}
                          onClick={() => {
                            setSelectedUrl(item);
                            dispatchConfirm({
                              type: 'open_dialog',
                              payload: {
                                title: 'Xác nhận',
                                content: (
                                  <Box>
                                    <Paragraph>
                                      Bạn có chắc chắn muốn xoá ảnh này?
                                    </Paragraph>
                                    <FlexBox justifyContent='flex-start'>
                                      <img
                                        src={item}
                                        alt={`Image ${index}`}
                                        style={{
                                          objectFit: 'contain',
                                          width: '100%',
                                          maxWidth: '300px',
                                        }}
                                      />
                                    </FlexBox>
                                  </Box>
                                ),
                                isLoading: isDeletingImageUrl,
                              },
                            });
                          }}
                          variant='text'
                          color='error'
                          startIcon={<DeleteOutlineOutlinedIcon />}
                        >
                          Xóa ảnh
                        </LoadingButton>
                      }
                      actionPosition='left'
                    />
                  </Fragment>
                )}
              </GalleryItem>
            </ImageListItem>
          ))}
        </Gallery>
      </ImageList>

      <FlexBox mt={4} flexDirection='row-reverse'>
        <LoadingButton
          loading={isUploadingImage || isPushingImageUrls}
          variant='contained'
          color='primary'
          startIcon={<Add />}
          onClick={() => {
            if (uploadRef && uploadRef.current) {
              uploadRef.current.click();
            }
          }}
        >
          Thêm ảnh
        </LoadingButton>
      </FlexBox>

      <Box display='none'>
        <UploadMultipleFilesInput
          folderName={`products/${product.category.slug}/${product.slug}`}
          onError={onUploadError}
          onStart={onUploadStart}
          onSuccess={onUploadSuccess}
          inputRef={uploadRef}
        />
      </Box>

      <ConfirmDialog
        open={confirmState.open}
        content={confirmState.content}
        title={confirmState.title}
        isLoading={isDeletingImageUrl}
        handleCancel={() => dispatchConfirm({ type: 'cancel_dialog' })}
        handleConfirm={() => {
          deleteImageUrl(selectedUrl);
        }}
      />
    </Fragment>
  );
};

export default ImageListForm;
