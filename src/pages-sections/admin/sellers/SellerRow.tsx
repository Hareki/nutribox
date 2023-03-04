import { Delete, Edit, RemoveRedEye } from '@mui/icons-material';
import { Avatar, Box } from '@mui/material';
import { FC, useState } from 'react';

import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from '../StyledComponents';

import BazaarSwitch from 'components/BazaarSwitch';
import { FlexBox } from 'components/flex-box';
import { Paragraph, Small } from 'components/Typography';
import { currency } from 'lib';

// ========================================================================
type SellerRowProps = { seller: any };
// ========================================================================

const SellerRow: FC<SellerRowProps> = ({ seller }) => {
  const {
    name,
    phone,
    image,
    balance,
    published,
    shopName,
    package: sellerPackage,
  } = seller;

  const [shopPublish, setShopPublish] = useState(published);

  return (
    <StyledTableRow tabIndex={-1} role='checkbox'>
      <StyledTableCell align='left'>
        <FlexBox alignItems='center' gap={1.5}>
          <Avatar src={image} alt={name} />
          <Box>
            <Paragraph>{name}</Paragraph>
            <Small color='grey.600'>{phone}</Small>
          </Box>
        </FlexBox>
      </StyledTableCell>

      <StyledTableCell align='left'>{shopName}</StyledTableCell>

      <StyledTableCell align='left' sx={{ fontWeight: 400 }}>
        {sellerPackage}
      </StyledTableCell>

      <StyledTableCell align='left' sx={{ fontWeight: 400 }}>
        {currency(balance)}
      </StyledTableCell>

      <StyledTableCell align='left'>
        <BazaarSwitch
          color='info'
          checked={shopPublish}
          onChange={() => setShopPublish((state) => !state)}
        />
      </StyledTableCell>

      <StyledTableCell align='center'>
        <StyledIconButton>
          <Edit />
        </StyledIconButton>

        <StyledIconButton>
          <RemoveRedEye />
        </StyledIconButton>

        <StyledIconButton>
          <Delete />
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default SellerRow;
