import { useRouter } from 'next/router';
import type { FC } from 'react';

import type { FilteredCategory } from '../../../../pages/staff/categories';
import { StyledTableCell, StyledTableRow } from '../StyledComponents';

import AvailabilityChip from './AvailabilityChip';

import { Paragraph } from 'components/abstract/Typography';
import { CATEGORY_DETAIL_ROUTE } from 'constants/routes.ui.constant';
import { insertId } from 'utils/middleware.helper';

type CategoryRowProps = { category: FilteredCategory };

const CategoryRow: FC<CategoryRowProps> = ({ category }) => {
  const { name, available, id } = category;
  console.log('file: CategoryRow.tsx:15 - available:', available);

  const router = useRouter();

  return (
    <StyledTableRow
      tabIndex={-1}
      role='checkbox'
      onClick={() => router.push(insertId(CATEGORY_DETAIL_ROUTE, id))}
    >
      <StyledTableCell align='left'>
        <Paragraph>{name}</Paragraph>
      </StyledTableCell>

      <StyledTableCell align='left'>
        <AvailabilityChip available={available} />
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default CategoryRow;
