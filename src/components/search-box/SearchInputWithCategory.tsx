import { KeyboardArrowDownOutlined } from '@mui/icons-material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Box, MenuItem, TextField, styled, useTheme } from '@mui/material';
import TouchRipple from '@mui/material/ButtonBase';
import Link from 'next/link';
import type { ChangeEvent, FC } from 'react';
import { useEffect, useRef, useState, useTransition } from 'react';

import { SearchOutlinedIcon, SearchResultCard } from './styled';

import CustomMenu from 'components/common/input/CustomMenu';
import { FlexBox } from 'components/flex-box';

const DropDownHandler = styled(FlexBox)(({ theme }) => ({
  whiteSpace: 'pre',
  borderTopRightRadius: 300,
  borderBottomRightRadius: 300,
  borderLeft: `1px solid ${theme.palette.text.disabled}`,
  [theme.breakpoints.down('xs')]: { display: 'none' },
}));

const SearchInputWithCategory: FC = () => {
  const parentRef = useRef();
  const { breakpoints } = useTheme();
  const [_, startTransition] = useTransition();
  const [category, setCategory] = useState('*');
  const [resultList, setResultList] = useState<string[]>([]);
  const [categoryTitle, setCategoryTitle] = useState('All Categories');

  // HANDLE CHANGE THE CATEGORY
  const handleCategoryChange =
    (cat: { title: string; value: string }) => () => {
      setCategory(cat.value);
      setCategoryTitle(cat.title);
    };

  // FETCH PRODUCTS VIA API
  const getProducts = async (searchText: string, category?: string) => {
    // const data = await api.searchProducts(searchText, category);
    // setResultList(data);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      const value = e.target?.value;

      if (!value) setResultList([]);
      else if (value && category !== '*') getProducts(value, category);
      else getProducts(value);
    });
  };

  useEffect(() => {
    const handleDocumentClick = () => setResultList([]);
    window.addEventListener('click', handleDocumentClick);
    return () => window.removeEventListener('click', handleDocumentClick);
  }, []);

  // CATEGORY MENU DROPDOWN
  const categoryDropdown = (
    <CustomMenu
      direction='left'
      sx={{ zIndex: breakpoints.down('md') ? 99999 : 1502 }}
      handler={
        <DropDownHandler
          px={3}
          gap={0.5}
          height='100%'
          color='grey.700'
          bgcolor='grey.100'
          alignItems='center'
          component={TouchRipple}
        >
          {categoryTitle}
          <KeyboardArrowDownOutlined fontSize='small' color='inherit' />
        </DropDownHandler>
      }
    >
      {categories.map((item) => (
        <MenuItem key={item.value} onClick={handleCategoryChange(item)}>
          {item.title}
        </MenuItem>
      ))}
    </CustomMenu>
  );
  const test = <ShoppingBagIcon />;
  return (
    <Box
      position='relative'
      flex='1 1 0'
      maxWidth='670px'
      mx='auto'
      {...{ ref: parentRef }}
    >
      <TextField
        fullWidth
        variant='outlined'
        placeholder='Tìm kiếm...'
        onChange={handleSearch}
        InputProps={{
          sx: {
            height: 44,
            paddingRight: 0,
            borderRadius: 300,
            color: 'grey.700',
            overflow: 'hidden',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          },
          endAdornment: categoryDropdown,
          startAdornment: <SearchOutlinedIcon fontSize='small' />,
        }}
      />

      {resultList.length > 0 && (
        <SearchResultCard elevation={2}>
          {resultList.map((item) => (
            <Link
              href={`/product/search/${item}`}
              key={item}
              passHref
              legacyBehavior
            >
              <MenuItem key={item}>{item}</MenuItem>
            </Link>
          ))}
        </SearchResultCard>
      )}
    </Box>
  );
};

const categories = [
  { title: 'All Categories', value: '*' },
  { title: 'Car', value: 'car' },
  { title: 'Clothes', value: 'clothes' },
  { title: 'Electronics', value: 'electronics' },
  { title: 'Laptop', value: 'laptop' },
  { title: 'Desktop', value: 'desktop' },
  { title: 'Camera', value: 'camera' },
  { title: 'Toys', value: 'toys' },
];

export default SearchInputWithCategory;
