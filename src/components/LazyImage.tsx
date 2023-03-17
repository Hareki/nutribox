import type {
  SpacingProps,
  BordersProps } from '@mui/system';
import {
  styled,
  bgcolor,
  compose,
  spacing,
  borderRadius,
} from '@mui/system';
import type { ImageProps } from 'next/legacy/image';
import NextImage from 'next/legacy/image';
import type { FC } from 'react';

type Props = ImageProps & BordersProps & SpacingProps;

const LazyImage = styled<FC<Props>>(({ borderRadius, ...rest }) => (
  <NextImage {...rest} />
))(compose(spacing, borderRadius, bgcolor));

export default LazyImage;
