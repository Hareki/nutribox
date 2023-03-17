import type { SvgIconProps } from '@mui/material';
import { SvgIcon } from '@mui/material';
import React from 'react';

const GiftBox = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox='0 0 22 20'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M16.5354 0.87868C15.3638 -0.292893 13.4644 -0.292893 12.2928 0.87868L10.8786 2.29289C10.8183 2.35317 10.7611 2.41538 10.707 2.47931C10.653 2.41539 10.5958 2.3532 10.5355 2.29293L9.12132 0.878715C7.94975 -0.292858 6.05025 -0.292858 4.87868 0.878715C3.70711 2.05029 3.70711 3.94978 4.87868 5.12136L5.75732 6H0V12H2V20H20V12H22V6H15.6567L16.5354 5.12132C17.707 3.94975 17.707 2.05025 16.5354 0.87868ZM13.707 5.12132L15.1212 3.70711C15.5117 3.31658 15.5117 2.68342 15.1212 2.29289C14.7307 1.90237 14.0975 1.90237 13.707 2.29289L12.2928 3.70711C11.9023 4.09763 11.9023 4.7308 12.2928 5.12132C12.6833 5.51184 13.3165 5.51184 13.707 5.12132ZM9.12132 3.70714L7.70711 2.29293C7.31658 1.9024 6.68342 1.9024 6.29289 2.29293C5.90237 2.68345 5.90237 3.31662 6.29289 3.70714L7.70711 5.12136C8.09763 5.51188 8.7308 5.51188 9.12132 5.12136C9.51184 4.73083 9.51184 4.09767 9.12132 3.70714ZM20 8V10H2V8H20ZM11.9167 12H18V18H11.9167V12ZM10.0834 12V18H4V12H10.0834Z'
        fill='#D23F57'
      />
    </SvgIcon>
  );
};

export default GiftBox;
