import { CircularProgress } from '@mui/material';
import type { ComponentProps, FC } from 'react';

import { FlexBox } from 'components/flex-box';

type Props = ComponentProps<typeof CircularProgress> & {
  height?: number;
};

const CircularProgressBlock: FC<Props> = ({
  height = '300px',
  ...circularProps
}) => {
  return (
    <FlexBox justifyContent='center' alignItems='center' height={height}>
      <CircularProgress {...circularProps} />
    </FlexBox>
  );
};

export default CircularProgressBlock;
