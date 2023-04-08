import { Add } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Fragment } from 'react';
import { Gallery, Item } from 'react-photoswipe-gallery';

import { FlexBox } from 'components/flex-box';

import 'photoswipe/dist/photoswipe.css';

interface ImageListFormProps {
  images: string[];
}
const ImageListForm = ({ images }: ImageListFormProps) => {
  return (
    <Fragment>
      <ImageList sx={{ maxHeight: 200 }} cols={2} rowHeight={200}>
        <Gallery>
          {images.map((item, index) => (
            <ImageListItem
              key={item}
              sx={{ position: 'relative', display: 'flex' }}
            >
              <Item
                original={item}
                thumbnail={item}
                alt={`Image ${index}`}
                width='1024'
                height='768'
              >
                {({ ref, open }) => (
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
                      maxWidth: '266.67px',
                    }}
                    // maxHeight='200'
                    // width='266.67'
                    ref={ref as React.MutableRefObject<HTMLImageElement>}
                    onClick={open}
                  />
                )}
              </Item>
            </ImageListItem>
          ))}
        </Gallery>
      </ImageList>

      <FlexBox mt={4} flexDirection='row-reverse'>
        <LoadingButton
          loading={false}
          variant='contained'
          color='primary'
          startIcon={<Add />}
        >
          Thêm ảnh
        </LoadingButton>
      </FlexBox>
    </Fragment>
  );
};

export default ImageListForm;
