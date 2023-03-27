import { Avatar, Box } from '@mui/material';
import { useRouter } from 'next/router';
import type { FC } from 'react';

import type { FilteredProduct } from '../../../../pages/admin/product';
import {
  StyledTableRow,
  CategoryWrapper,
  StyledTableCell,
} from '../StyledComponents';

import { Paragraph, Small } from 'components/abstract/Typography';
import { FlexBox } from 'components/flex-box';
import { formatCurrency } from 'lib';

// ========================================================================
type ProductRowProps = { product: FilteredProduct };
// ========================================================================

const ProductRow: FC<ProductRowProps> = ({ product }) => {
  const {
    id,
    name,
    category,
    retailPrice,
    wholesalePrice,
    imageUrls,
    shelfLife,
  } = product;

  const router = useRouter();

  return (
    <StyledTableRow
      tabIndex={-1}
      role='checkbox'
      onClick={() => router.push(`/admin/product/${id}`)}
    >
      <StyledTableCell align='left'>
        <FlexBox alignItems='center' gap={1.5}>
          <Avatar
            variant='square'
            src={imageUrls[0]}
            sx={{ objectFit: 'contain' }}
          />
          <Box>
            <Paragraph>{name}</Paragraph>
            <Small color='grey.600'>#{id.slice(-6)}</Small>
          </Box>
        </FlexBox>
      </StyledTableCell>

      <StyledTableCell align='left'>
        <CategoryWrapper>{category}</CategoryWrapper>
      </StyledTableCell>

      <StyledTableCell align='left'>
        {formatCurrency(wholesalePrice)}
      </StyledTableCell>

      <StyledTableCell align='left'>
        {formatCurrency(retailPrice)}
      </StyledTableCell>

      <StyledTableCell align='center'>
        <StyledTableCell align='left'>{shelfLife}</StyledTableCell>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default ProductRow;
