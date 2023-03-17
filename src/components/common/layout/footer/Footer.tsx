import CopyrightRounded from '@mui/icons-material/CopyrightRounded';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhone from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  styled,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { FC } from 'react';

import { H3 } from 'components/abstract/Typography';
import Image from 'components/common/input/CustomImage';
import { FlexBox } from 'components/flex-box';
import Facebook from 'components/icons/Facebook';
import Google from 'components/icons/Google';
import Instagram from 'components/icons/Instagram';
import Twitter from 'components/icons/Twitter';
import Youtube from 'components/icons/Youtube';

const StyledHeader = styled(H3)({
  fontSize: '28px',
  fontWeight: 600,
  color: 'grey.600',
  marginBottom: '1.25rem',
});

const Footer: FC = () => {
  return (
    <footer>
      <Box bgcolor='grey.450'>
        <Container sx={{ p: '1rem' }}>
          <Box py={5} overflow='hidden'>
            <Grid container spacing={10}>
              <Grid
                item
                lg={6}
                md={6}
                sm={6}
                xs={12}
                sx={{ display: 'flex', flexDirection: 'column' }}
              >
                <StyledHeader
                  fontSize='28px'
                  fontWeight={600}
                  color='grey.600'
                  mb={2.5}
                >
                  Liên hệ với chúng tôi
                </StyledHeader>
                <Link href='/'>
                  <Image
                    mb={2.5}
                    height={50}
                    src='/assets/images/logo.svg'
                    alt='logo'
                  />
                </Link>

                <FlexBox mb={4} className='flex'>
                  {iconList.map((item, index) => (
                    <a
                      href={item.url}
                      target='_blank'
                      rel='noreferrer noopenner'
                      key={index}
                    >
                      <IconButton
                        sx={{
                          margin: 0.5,
                          fontSize: 12,
                          padding: '10px',
                          backgroundColor: 'grey.700',
                          transition: 'background-color .3s ease',
                          ':hover': { backgroundColor: 'grey.600' },
                        }}
                      >
                        <item.icon fontSize='inherit' sx={{ color: 'white' }} />
                      </IconButton>
                    </a>
                  ))}
                </FlexBox>

                <FlexBox gap={2} flexDirection='column'>
                  <FlexBox alignItems='center' color='grey.700' gap={1}>
                    <LocationOnIcon />
                    <Typography>
                      97 Man Thiện, Phường Hiệp Phú, Thủ Đức, TP. Hồ Chí Minh
                    </Typography>
                  </FlexBox>

                  <FlexBox alignItems='center' color='grey.700' gap={1}>
                    <LocalPhone />
                    <Typography>
                      <a href='tel:0338758008'>033 875 8008</a>
                    </Typography>
                  </FlexBox>

                  <FlexBox alignItems='center' color='grey.700' gap={1}>
                    <EmailIcon />
                    <Typography>
                      <a href='mailto:n18dccn192@student.ptithcm.edu.vn'>
                        n18dccn192@student.ptithcm.edu.vn
                      </a>
                    </Typography>
                  </FlexBox>
                </FlexBox>

                <FlexBox mt='auto' alignItems='center' color='grey.600' gap={1}>
                  <CopyrightRounded />
                  <Typography>
                    2023 Bản quyền thuộc Công ty TNHH Nutribox. Tất cả các quyền
                    được bảo lưu
                  </Typography>
                </FlexBox>
              </Grid>

              <Grid item lg={6} md={6} sm={6} xs={12}>
                <StyledHeader
                  fontSize='28px'
                  fontWeight={600}
                  color='grey.600'
                  mb={2.5}
                >
                  Giờ làm việc
                </StyledHeader>
                <Stack
                  divider={
                    <Divider
                      orientation='horizontal'
                      flexItem
                      sx={{ borderColor: 'grey.400' }}
                    />
                  }
                  spacing={2}
                >
                  {workHours.map((item, index) => (
                    <FlexBox key={index} justifyContent='space-between'>
                      <Typography color='grey.600'>{item.day}</Typography>
                      <Typography color='grey.600'>{item.time}</Typography>
                    </FlexBox>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </footer>
  );
};

const workHours = [
  {
    day: 'Thứ 2',
    time: '8:00 - 18:00',
  },
  {
    day: 'Thứ 3',
    time: '8:00 - 18:00',
  },
  {
    day: 'Thứ 4',
    time: '8:00 - 18:00',
  },
  {
    day: 'Thứ 5',
    time: '8:00 - 18:00',
  },
  {
    day: 'Thứ 6',
    time: '8:00 - 18:00',
  },
  {
    day: 'Thứ 7',
    time: '8:00 - 18:00',
  },
  {
    day: 'Chủ nhật',
    time: '8:00 - 18:00',
  },
];

const iconList = [
  { icon: Facebook, url: 'https://www.facebook.com' },
  { icon: Twitter, url: 'https://twitter.com' },
  {
    icon: Youtube,
    url: 'https://www.youtube.com',
  },
  { icon: Google, url: 'https://www.google.com' },
  { icon: Instagram, url: 'https://www.instagram.com' },
];

export default Footer;
