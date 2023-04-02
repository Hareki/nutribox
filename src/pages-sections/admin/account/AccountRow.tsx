import { Avatar } from '@mui/material';
import { useRouter } from 'next/router';
import type { FC } from 'react';

import type { FilteredAccount } from '../../../../pages/admin/account';
import { StyledTableCell, StyledTableRow } from '../StyledComponents';

import { Paragraph } from 'components/abstract/Typography';
import { FlexBox } from 'components/flex-box';
import { getAvatarUrl } from 'helpers/account.helper';
import { formatDate } from 'lib';

type AccountRowProps = { account: FilteredAccount };

const AccountRow: FC<AccountRowProps> = ({ account }) => {
  const { email, fullName, phone, totalOrders, birthday, id } = account;
  const avatarUrl = getAvatarUrl(account);
  const router = useRouter();

  return (
    <StyledTableRow
      tabIndex={-1}
      role='checkbox'
      onClick={() => router.push(`/admin/account/${id}`)}
    >
      <StyledTableCell align='left'>
        <FlexBox alignItems='center' gap={1.5}>
          <Avatar
            src={avatarUrl}
            sx={{
              '& img': {
                objectFit: 'contain',
              },
            }}
          />
          <Paragraph>{fullName}</Paragraph>
        </FlexBox>
      </StyledTableCell>

      <StyledTableCell align='left' sx={{ fontWeight: 400 }}>
        {formatDate(birthday)}
      </StyledTableCell>

      <StyledTableCell align='left' sx={{ fontWeight: 400 }}>
        {phone}
      </StyledTableCell>

      <StyledTableCell align='left' sx={{ fontWeight: 400 }}>
        {email}
      </StyledTableCell>

      <StyledTableCell align='center' sx={{ fontWeight: 400 }}>
        {totalOrders}
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default AccountRow;
