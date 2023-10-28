import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import type { FC } from 'react';

import { StyledTableCell, StyledTableRow } from '../StyledComponents';

import type { FilteredAddress } from './AccountAddressViewer';

import { Paragraph } from 'components/abstract/Typography';

type AddressRowProps = { address: FilteredAddress };

const AddressRow: FC<AddressRowProps> = ({ address }) => {
  const { fullAddress, isDefault, title } = address;

  return (
    <StyledTableRow cursor='auto' tabIndex={-1}>
      <StyledTableCell align='left' font_weight={400}>
        <Paragraph>{title}</Paragraph>
      </StyledTableCell>

      <StyledTableCell align='left' font_weight={400}>
        <Paragraph>{fullAddress}</Paragraph>
      </StyledTableCell>

      <StyledTableCell align='center' font_weight={400}>
        <Paragraph>
          {isDefault && <CheckRoundedIcon color='primary' />}
        </Paragraph>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default AddressRow;
