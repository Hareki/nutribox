import { Avatar, Box } from '@mui/material';
import { useRouter } from 'next/router';
import type { FC } from 'react';

import type { FilteredProduct } from '../../../../pages/staff/products';
import {
  StyledTableRow,
  CategoryWrapper,
  StyledTableCell,
} from '../StyledComponents';

import { Paragraph, Small } from 'components/abstract/Typography';
import { FlexBox } from 'components/flex-box';
import { PRODUCT_DETAIL_STAFF_ROUTE } from 'constants/routes.ui.constant';
import { formatCurrency } from 'lib';
import { insertId } from 'utils/middleware.helper';

// ========================================================================
type ProductRowProps = { product: FilteredProduct };
// ========================================================================

const ProductRow: FC<ProductRowProps> = ({ product }) => {
  const {
    id,
    name,
    category,
    retailPrice,
    imageUrls,
    remainingStock,
    shelfLife,
  } = product;

  const router = useRouter();

  return (
    <StyledTableRow
      tabIndex={-1}
      role='checkbox'
      onClick={() => router.push(insertId(PRODUCT_DETAIL_STAFF_ROUTE, id))}
    >
      <StyledTableCell align='left'>
        <FlexBox alignItems='center' gap={1.5}>
          <Avatar
            variant='square'
            src={imageUrls[0]}
            sx={{
              '& img': {
                objectFit: 'contain',
              },
            }}
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

      <StyledTableCell align='center'>
        {formatCurrency(retailPrice)}
      </StyledTableCell>

      <StyledTableCell align='center'>{shelfLife}</StyledTableCell>

      <StyledTableCell align='center'>{remainingStock}</StyledTableCell>
    </StyledTableRow>
  );
};

export default ProductRow;
