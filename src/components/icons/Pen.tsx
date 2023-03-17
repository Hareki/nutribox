import type { SvgIconProps } from '@mui/material';
import { SvgIcon } from '@mui/material';
import React from 'react';

const Pen = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox='0 0 15 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M13.1718 0.390293C12.9127 0.130909 12.4926 0.130909 12.2335 0.390293L11.6547 0.969704C10.9149 0.615886 10.0019 0.745714 9.38913 1.35919L2.35213 8.40402L6.1052 12.1613L13.1422 5.11643C13.755 4.50296 13.8847 3.58899 13.5313 2.84833L14.11 2.26891C14.3691 2.00953 14.3691 1.58899 14.11 1.3296L13.1718 0.390293ZM10.3401 6.043L6.1052 10.2826L4.22866 8.40402L8.4636 4.16438L10.3401 6.043ZM11.5465 4.83531L12.2039 4.17712C12.463 3.91774 12.463 3.49719 12.2039 3.23781L11.2657 2.2985C11.0066 2.03911 10.5865 2.03911 10.3274 2.2985L9.66994 2.95669L11.5465 4.83531Z'
        fill='currentColor'
      />
      <path
        d='M0.391296 14.1107L1.79895 8.94428L5.55177 12.7018L0.391296 14.1107Z'
        fill='currentColor'
      />
    </SvgIcon>
  );
};

export default Pen;
