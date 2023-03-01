import { FC } from "react";
import NextImage, { ImageProps } from "next/image";
import {
  styled,
  bgcolor,
  compose,
  spacing,
  borderRadius,
  SpacingProps,
  BordersProps,
} from "@mui/system";

type Props = ImageProps & BordersProps & SpacingProps;

const LazyImage = styled<FC<Props>>(({ borderRadius, ...rest }) => (
  <NextImage {...rest} />
))(compose(spacing, borderRadius, bgcolor));

export default LazyImage;
