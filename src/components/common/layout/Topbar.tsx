import {
  Add,
  ExpandMore,
  Facebook,
  Instagram,
  Remove,
  Twitter,
} from '@mui/icons-material';
import {
  Box,
  Chip,
  Container,
  IconButton,
  MenuItem,
  styled,
} from '@mui/material';
import TouchRipple from '@mui/material/ButtonBase';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import CustomMenu from '../input/CustomMenu';

import { Span } from 'components/abstract/Typography';
import { FlexBetween, FlexBox } from 'components/flex-box';
import { LayoutConstant } from 'utils/constants';

// styled component
const TopbarWrapper = styled(Box, {
  shouldForwardProp: (props) => props !== 'bgColor',
})<{ bgColor: string | undefined; expand: number }>(
  ({ theme, bgColor, expand }) => ({
    fontSize: 12,
    height: LayoutConstant.topbarHeight,
    color: theme.palette.secondary.contrastText,
    background: bgColor || theme.palette.grey[900],
    transition: 'height 300ms ease',
    '& .menuItem': { minWidth: 100 },
    '& .marginRight': { marginRight: '1.25rem' },
    '& .expand': { display: 'none', padding: 0 },
    '& .handler': { height: LayoutConstant.topbarHeight },
    '& .menuTitle': { fontSize: 12, marginLeft: '0.5rem', fontWeight: 600 },

    [theme.breakpoints.down('sm')]: {
      height: expand ? 80 : LayoutConstant.topbarHeight,
      '& .topbarRight': { display: expand ? 'flex' : 'none', paddingBottom: 5 },
      '& .expand': { display: 'block', height: LayoutConstant.topbarHeight },
      '& .MuiSvgIcon-root': { color: 'white' },
    },
  }),
);

const StyledContainer = styled(Container)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    alignItems: 'start',
    flexDirection: 'column',
  },
}));

// ===========================================
type TopbarProps = { bgColor?: string };
// ===========================================

const Topbar: FC<TopbarProps> = ({ bgColor }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { pathname, asPath, query } = router;

  const [expand, setExpand] = useState<boolean>(false);
  const [language, setLanguage] = useState(router.locale);

  const handleLanguageClick = (lang: string) => () => {
    setLanguage(lang);
    router.push({ pathname, query }, asPath, { locale: lang });
  };

  return (
    <TopbarWrapper bgColor={bgColor} expand={expand ? 1 : 0}>
      <StyledContainer>
        <FlexBetween width='100%'>
          <FlexBox alignItems='center' gap={1}>
            <Chip
              label='HOT'
              size='small'
              sx={{
                color: 'white',
                fontWeight: 700,
                backgroundColor: 'primary.main',
                '& .MuiChip-label': { pl: '.8rem', pr: '.8rem' },
              }}
            />
            <Span className='title'>{t('Free Express Shipping')}</Span>
          </FlexBox>

          <IconButton
            disableRipple
            className='expand'
            onClick={() => setExpand((state) => !state)}
          >
            {expand ? <Remove /> : <Add />}
          </IconButton>
        </FlexBetween>

        <FlexBox className='topbarRight' alignItems='center'>
          <CustomMenu
            handler={
              <TouchRipple className='handler marginRight'>
                <Span className='menuTitle'>
                  {language === 'en' ? 'EN' : 'VN'}
                </Span>
                <ExpandMore fontSize='inherit' />
              </TouchRipple>
            }
          >
            {languageList.map((item) => (
              <MenuItem
                key={item.title}
                className='menuItem'
                onClick={handleLanguageClick(item.value)}
              >
                <Span className='menuTitle'>{item.title}</Span>
              </MenuItem>
            ))}
          </CustomMenu>

          <FlexBox alignItems='center' gap={1.5}>
            {socialLinks.map(({ id, Icon, url }) => (
              <Link href={url} key={id} style={{ lineHeight: 0 }}>
                <Icon sx={{ fontSize: 16 }} />
              </Link>
            ))}
          </FlexBox>
        </FlexBox>
      </StyledContainer>
    </TopbarWrapper>
  );
};

const socialLinks = [
  { id: 1, Icon: Twitter, url: '#' },
  { id: 2, Icon: Facebook, url: '#' },
  { id: 3, Icon: Instagram, url: '#' },
];

const languageList = [
  { title: 'EN', value: 'en' },
  { title: 'VN', value: 'vn' },
];

export default Topbar;
