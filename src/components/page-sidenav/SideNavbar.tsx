import { Box, styled, Theme, useTheme } from '@mui/material';
import { FC, useState } from 'react';

import Accordion from 'components/accordion/Accordion';
import AccordionHeader from 'components/accordion/AccordionHeader';
import BazaarCard from 'components/BazaarCard';
import { FlexBetween, FlexBox } from 'components/flex-box';
import appIcons from 'components/icons';
import Scrollbar from 'components/Scrollbar';
import { H5, Span } from 'components/Typography';
import CategoryNavList from 'models/CategoryNavList.model';

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
type SideNavbarProps = {
  isFixed?: boolean;
  navList: CategoryNavList[];
  lineStyle?: 'dash' | 'solid';
  sidebarHeight?: string | number;
  sidebarStyle?: 'style1' | 'style2';
  handleSelect?: (category: string) => void;
};
// ==================================================================

const SideNavbar: FC<SideNavbarProps> = (props) => {
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

  const selectHandler = (index: number, title: string) => {
    setSelectedIndex(index);
    handleSelect(title);
  };

  return (
    <Scrollbar autoHide={false} sx={{ maxHeight: sidebarHeight }}>
      <NavbarRoot isfixed={isFixed} sidebarstyle={sidebarStyle}>
        {navList.map((item, index) => {
          return (
            <Box key={index}>
              <Box padding='16px 20px 5px 20px'>
                <H5>{item.category}</H5>

                <BorderBox linestyle={lineStyle}>
                  <ColorBorder width='140% !important' />
                  <ColorBorder grey={1} />
                </BorderBox>
              </Box>

              {item.categoryItem.map((item, index) => {
                const Icon = appIcons[item.icon];

                return (
                  <Box mb='2px' color='grey.700' key={index}>
                    <Box
                      key={item.title}
                      onClick={() => selectHandler(index, item.title)}
                      sx={{
                        color:
                          selectedIndex === index ? 'primary.500' : 'grey.700',
                        cursor: 'pointer',
                        '&:hover': {
                          color: 'primary.500',
                        },
                      }}
                    >
                      <FlexBox gap={1.5} className='linkList' py={0.75}>
                        <Icon fontSize='small' />
                        <Span fontWeight='600'>{item.title}</Span>
                      </FlexBox>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </NavbarRoot>
    </Scrollbar>
  );
};

SideNavbar.defaultProps = {
  lineStyle: 'solid',
  sidebarHeight: 'auto',
  sidebarStyle: 'style1',
};

export default SideNavbar;
