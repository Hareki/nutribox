import { Add } from '@mui/icons-material';
import type { Theme } from '@mui/material';
import { Button, useMediaQuery } from '@mui/material';
import type { FC } from 'react';

import { FlexBox } from 'components/flex-box';
import SearchInput from 'components/SearchInput';

type SearchAreaProps = {
  buttonText?: string;
  handleSearch: () => void;
  searchPlaceholder: string;
  handleBtnClick?: () => void;
  haveButton?: boolean;
};

const SearchArea: FC<SearchAreaProps> = (props) => {
  const { searchPlaceholder, buttonText, handleBtnClick } = props;
  const downSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <FlexBox mb={2} gap={2} justifyContent='space-between' flexWrap='wrap'>
      <SearchInput placeholder={searchPlaceholder} />

      {props.haveButton && (
        <Button
          color='primary'
          fullWidth={downSM}
          variant='contained'
          startIcon={<Add />}
          onClick={handleBtnClick}
          sx={{ minHeight: 44 }}
        >
          {buttonText}
        </Button>
      )}
    </FlexBox>
  );
};

SearchArea.defaultProps = {
  buttonText: 'Add Product',
  searchPlaceholder: 'Search Product...',
};

export default SearchArea;
