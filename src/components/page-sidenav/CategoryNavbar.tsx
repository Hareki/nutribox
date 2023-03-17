import { Box, styled, useTheme } from '@mui/material';
import type { FC } from 'react';
import { useState } from 'react';

import type { IProductCategory } from 'api/models/ProductCategory.model/types';
import { H5, Span } from 'components/abstract/Typography';
import BazaarCard from 'components/common/BazaarCard';
import { FlexBetween, FlexBox } from 'components/flex-box';
import Scrollbar from 'components/Scrollbar';

const NavbarRoot = styled(BazaarCard)<{
  isfixed: boolean;
  sidebarstyle: 'style1' | 'style2';
}>(({ isfixed, theme, sidebarstyle }) => ({
  height: '100%',
  boxShadow: 'none',
  borderRadius: '8px',
  position: 'relative',
  overflow: isfixed ? 'auto' : 'unset',
  '& .linkList': { transition: 'all 0.2s', padding: '8px 20px' },
  ...(sidebarstyle === 'style2' && {
    height: 'auto',
    paddingBottom: 10,
    backgroundColor: theme.palette.primary[50],
  }),
}));

const StyledList = styled(FlexBox)(({ theme }) => ({
  transition: 'all 0.2s',
  padding: '4px 20px',
  alignItems: 'center',
  '& .listCircle': { background: theme.palette.grey[600] },
  '&:hover': { '& .listCircle': { background: theme.palette.primary[300] } },
}));

const BorderBox = styled(FlexBetween)<{ linestyle: 'dash' | 'solid' }>(
  ({ theme, linestyle }) => ({
    marginTop: 5,
    marginBottom: 15,
    '& span': { width: '100%' },
    ...(linestyle === 'dash' && {
      borderBottom: '2px',
      borderStyle: 'none none dashed none',
      borderColor: theme.palette.primary.main,
      '& span': { display: 'none' },
    }),
  }),
);

const ColorBorder = styled(Span)<{ grey?: any }>(({ grey, theme }) => ({
  borderRadius: '2px 0 0 2px',
  height: grey ? '2px' : '3px',
  background: grey ? theme.palette.grey[400] : theme.palette.primary[200],
}));

const Circle = styled('span')({
  width: '4px',
  height: '4px',
  marginLeft: '2rem',
  marginRight: '8px',
  borderRadius: '3px',
});

// ==================================================================
type CategoryNavbarProps = {
  isFixed?: boolean;
  navList: IProductCategory[];
  lineStyle?: 'dash' | 'solid';
  sidebarHeight?: string | number;
  sidebarStyle?: 'style1' | 'style2';
  handleSelect?: (categoryId: string, categoryName: string) => void;
};
// ==================================================================

const CategoryNavbar: FC<CategoryNavbarProps> = (props) => {
  const {
    isFixed,
    navList,
    lineStyle,
    sidebarStyle,
    sidebarHeight,
    handleSelect = () => undefined,
  } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { palette } = useTheme();

  const selectHandler = (index: number, id: string, name: string) => {
    setSelectedIndex(index);
    handleSelect(id, name);
  };

  return (
    <Scrollbar autoHide={false} sx={{ maxHeight: sidebarHeight }}>
      <NavbarRoot isfixed={isFixed} sidebarstyle={sidebarStyle}>
        <Box>
          <Box padding='16px 20px 5px 20px'>
            <H5>Danh mục món ăn</H5>

            <BorderBox linestyle={lineStyle}>
              <ColorBorder width='140% !important' />
              <ColorBorder grey={1} />
            </BorderBox>
          </Box>
          {navList.map((item, index) => {
            return (
              <Box mb='2px' color='grey.700' key={index}>
                <Box
                  // key={item}
                  onClick={() => selectHandler(index, item.id, item.name)}
                  sx={{
                    color: selectedIndex === index ? 'primary.500' : 'grey.700',
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'primary.500',
                    },
                  }}
                >
                  <FlexBox gap={1.5} className='linkList' py={0.75}>
                    <Span fontWeight='600'>{item.name}</Span>
                  </FlexBox>
                </Box>
              </Box>
            );
          })}
        </Box>
      </NavbarRoot>
    </Scrollbar>
  );
};

CategoryNavbar.defaultProps = {
  lineStyle: 'solid',
  sidebarHeight: 'auto',
  sidebarStyle: 'style1',
};

export default CategoryNavbar;
