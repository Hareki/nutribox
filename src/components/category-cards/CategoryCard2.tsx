import { Typography } from '@mui/material';
import type { FC } from 'react';

import { FlexRowCenter } from 'components/flex-box';
import LazyImage from 'components/LazyImage';

// ==============================================================
type Props = { Icon?: any; title: string; imgUrl?: string };
// ==============================================================

const CategoryCard2: FC<Props> = ({ title, imgUrl, Icon }) => {
  return (
    <FlexRowCenter flexDirection='column'>
      {imgUrl ? (
        <LazyImage
          width={100}
          height={100}
          src={imgUrl}
          alt='banner'
          objectFit='cover'
          borderRadius='5px'
        />
      ) : (
        Icon && <Icon size='48px'>{Icon}</Icon>
      )}
      <Typography
        className='ellipsis'
        textAlign='center'
        fontSize='11px'
        lineHeight='1'
        mt={1}
      >
        {title}
      </Typography>
    </FlexRowCenter>
  );
};

export default CategoryCard2;
