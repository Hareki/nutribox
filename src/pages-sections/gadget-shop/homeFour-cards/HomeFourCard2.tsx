import { styled } from '@mui/material';
import Link from 'next/link';
import { FC } from 'react';

import BazaarCard from 'components/BazaarCard';
import LazyImage from 'components/LazyImage';
import { H5 } from 'components/Typography';

// styled component
const StyledCard = styled(BazaarCard)(({ theme }) => ({
  borderRadius: '0px',
  height: '100%',
  boxShadow: theme.shadows[4],
  transition: 'all 250ms ease-in-out',
  '&:hover': { boxShadow: theme.shadows[2] },
}));

// ========================================================================
type Props = { title: string; imgUrl: string; headingStyle?: object };
// ========================================================================

const HomeFourCard2: FC<Props> = ({ imgUrl, title, headingStyle }) => {
  return (
    (<Link href='/sale-page-1'>

      <StyledCard>
        <LazyImage
          alt={title}
          src={imgUrl}
          width={100}
          height={100}
          layout='responsive'
        />
        <H5 sx={headingStyle ? headingStyle : { pb: '1rem', pl: '1.5rem' }}>
          {title}
        </H5>
      </StyledCard>

    </Link>)
  );
};

export default HomeFourCard2;
