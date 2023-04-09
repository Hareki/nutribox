import { Add } from '@mui/icons-material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { LoadingButton } from '@mui/lab';
import { Box, ImageListItemBar, useTheme } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import type { Dispatch } from 'react';
import { Fragment, useRef, useState } from 'react';
import { Gallery, Item as GalleryItem } from 'react-photoswipe-gallery';

import { Paragraph } from 'components/abstract/Typography';
import UploadFileInput from 'components/common/input/UploadFileInput';
import ConfirmDialog from 'components/dialog/confirm-dialog';
import type {
  ConfirmDialogAction,
  ConfirmDialogState,
} from 'components/dialog/confirm-dialog/reducer';
import { FlexBox } from 'components/flex-box';
import 'photoswipe/dist/photoswipe.css';

export interface UploadSuccessResponse {
  url: string;
}
interface ImageListFormProps {
  hasError?: boolean;
  confirmState: ConfirmDialogState;
  dispatchConfirm: Dispatch<ConfirmDialogAction>;
  isAddingImageUrls?: boolean;
  isDeletingImageUrl?: boolean;
  imageUrls: string[];
  onFilesSelected: (files: File[]) => void;
  onFileDeleted: (url: string, index?: number) => void;
}
const ImageListForm = ({
  hasError = false,
  confirmState,
  dispatchConfirm,
  isAddingImageUrls = false,
  isDeletingImageUrl = false,
  imageUrls,
  onFilesSelected,
  onFileDeleted,
}: ImageListFormProps) => {
  const { palette } = useTheme();
  const [selectedUrl, setSelectedUrl] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const uploadRef = useRef<HTMLInputElement>();

  const isEmpty = imageUrls.length === 0;
  return (
    <Fragment>
      {isEmpty ? (
        <Paragraph color={hasError ? palette.error.main : palette.grey[600]}>
          Chưa tải lên ảnh nào, vui lòng nhấp vào nút &quot;Thêm Ảnh&quot; bên
          dưới
        </Paragraph>
      ) : (
        <ImageList sx={{ maxHeight: 300 }} cols={2} rowHeight={300}>
          <Gallery>
            {imageUrls.map((item, index) => (
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
                        src={item}
                        alt={`Image ${index}`}
                        style={{
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          objectFit: 'contain',
                          cursor: 'pointer',
                          width: '100%',
                          maxWidth: '300px',
                        }}
                        ref={ref as React.MutableRefObject<HTMLImageElement>}
                        onClick={open}
                      />
                      <ImageListItemBar
                        sx={{
                          background: 'transparent',
                        }}
                        position='top'
                        actionIcon={
                          <LoadingButton
                            loading={isDeletingImageUrl}
                            onClick={() => {
                              setSelectedUrl(item);
                              setSelectedIndex(index);

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
      )}

      <FlexBox mt={4} flexDirection='row-reverse'>
        <LoadingButton
          loading={isAddingImageUrls}
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
        <UploadFileInput
          multiple
          inputRef={uploadRef}
          onFilesSelected={onFilesSelected}
        />
      </Box>

      <ConfirmDialog
        open={confirmState.open}
        content={confirmState.content}
        title={confirmState.title}
        isLoading={isDeletingImageUrl}
        handleCancel={() => dispatchConfirm({ type: 'cancel_dialog' })}
        handleConfirm={() => {
          onFileDeleted(selectedUrl, selectedIndex);
        }}
      />
    </Fragment>
  );
};

export default ImageListForm;
