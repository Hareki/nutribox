import { Box, Button, ListItemIcon, MenuItem, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ChangeEvent, FC } from 'react';
import { useRef, useState, useTransition } from 'react';
import { useDebounce } from 'usehooks-ts';

import { SearchOutlinedIcon, SearchResultCard } from './styled';

import apiCaller from 'api-callers/product/search';

const SearchInput: FC = () => {
  const parentRef = useRef();
  const router = useRouter();
  const [_, startTransition] = useTransition();
  const savedSearchQueryRef = useRef('');
  const [searchQuery, setSearchQuery] = useState('');
  const debounceSearchQuery = useDebounce(searchQuery, 200);

  const { data: searchResult } = useQuery({
    queryKey: ['product', 'search', debounceSearchQuery],
    queryFn: (context) => apiCaller.searchProductsByName(context.queryKey[2]),
    initialData: [],
  });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      const searchQuery = e.target?.value;
      setSearchQuery(searchQuery);
    });
  };

  return (
    <Box
      position='relative'
      flex='1 1 0'
      maxWidth='670px'
      mx='auto'
      {...{ ref: parentRef }}
    >
      <TextField
        onBlur={() => {
          savedSearchQueryRef.current = searchQuery;
          setSearchQuery('');
        }}
        onFocus={() => {
          setSearchQuery(savedSearchQueryRef.current);
        }}
        fullWidth
        variant='outlined'
        placeholder='Tìm sản phẩm...'
        onChange={handleSearch}
        InputProps={{
          sx: {
            height: 44,
            paddingRight: 0,
            borderRadius: 300,
            color: 'grey.700',
            // overflow: 'hidden',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          },
          endAdornment: (
            <Button
              color='primary'
              disableElevation
              variant='contained'
              onClick={() => {
                router.push(
                  {
                    pathname: '/',
                    query: {
                      productName: savedSearchQueryRef.current || searchQuery,
                      // used to reset the overrideSearchResult state, time's running out so this is the best I can do
                      requestedAt: new Date().getTime(),
                    },
                  },
                  undefined,
                  {
                    scroll: false,
                  },
                );
              }}
              sx={{
                px: '3rem',
                height: '100%',
                borderRadius: '0 300px 300px 0',
              }}
            >
              Tìm
            </Button>
          ),
          startAdornment: <SearchOutlinedIcon fontSize='small' />,
        }}
      />

      {searchResult.length > 0 && (
        <SearchResultCard elevation={2}>
          {searchResult.map((item) => (
            <Link
              href={`/product/${item.slug}`}
              key={item.id}
              passHref
              legacyBehavior
            >
              <MenuItem
                onClick={() => {
                  setSearchQuery('');
                }}
                key={item.id}
              >
                <ListItemIcon
                  sx={{
                    mr: 1,
                  }}
                >
                  <img src={item.imageUrls[0]} alt={item.name} width={40} />
                </ListItemIcon>
                {item.name}
              </MenuItem>
            </Link>
          ))}
        </SearchResultCard>
      )}
    </Box>
  );
};

export default SearchInput;
