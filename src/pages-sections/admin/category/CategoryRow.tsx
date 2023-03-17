import { Delete, Edit, RemoveRedEye } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';

import {
  StyledTableRow,
  CategoryWrapper,
  StyledIconButton,
  StyledTableCell,
} from '../StyledComponents';

import CustomSwitch from 'components/common/input/CustomSwitch';

// ========================================================================
type CategoryRowProps = {
  item: any;
  selected: any[];
};
// ========================================================================

const CategoryRow: FC<CategoryRowProps> = ({ item, selected }) => {
  const { image, name, level, featured, id, slug } = item;

  const router = useRouter();
  const [featuredCategory, setFeaturedCategory] = useState(featured);
  const isItemSelected = selected.indexOf(name) !== -1;

  const handleNavigate = () => router.push(`/admin/categories/${slug}`);

  return (
    <StyledTableRow tabIndex={-1} role='checkbox' selected={isItemSelected}>
      <StyledTableCell align='left'>#{id.split('-')[0]}</StyledTableCell>

      <StyledTableCell align='left'>
        <CategoryWrapper>{name}</CategoryWrapper>
      </StyledTableCell>

      <StyledTableCell align='left'>
        <Avatar src={image} sx={{ borderRadius: '8px' }} />
      </StyledTableCell>

      <StyledTableCell align='left'>{level}</StyledTableCell>

      <StyledTableCell align='left'>
        <CustomSwitch
          color='info'
          checked={featuredCategory}
          onChange={() => setFeaturedCategory((state: boolean) => !state)}
        />
      </StyledTableCell>

      <StyledTableCell align='center'>
        <StyledIconButton onClick={handleNavigate}>
          <Edit />
        </StyledIconButton>

        <StyledIconButton onClick={handleNavigate}>
          <RemoveRedEye />
        </StyledIconButton>

        <StyledIconButton>
          <Delete />
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default CategoryRow;
