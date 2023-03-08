import {
  styled,
  bgcolor,
  compose,
  spacing,
  borderRadius,
  SpacingProps,
  BordersProps,
} from '@mui/system';
import NextImage, { ImageProps } from 'next/legacy/image';
import { FC } from 'react';

type Props = ImageProps & BordersProps & SpacingProps;

const LazyImage = styled<FC<Props>>(({ borderRadius, ...rest }) => (
  <NextImage {...rest} />
))(compose(spacing, borderRadius, bgcolor));

export default LazyImage;
