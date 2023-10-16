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
  Skeleton,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import type { IStore } from 'api/models/Store.model/types';
import Link from 'next/link';
import type { FC } from 'react';

import apiCaller from 'api-callers/admin/store';
import { H3 } from 'components/abstract/Typography';
import Image from 'components/common/input/MuiImage';
import { FlexBox } from 'components/flex-box';
import Facebook from 'components/icons/Facebook';
import Google from 'components/icons/Google';
import Instagram from 'components/icons/Instagram';
import Twitter from 'components/icons/Twitter';
import Youtube from 'components/icons/Youtube';
import { getFullAddress } from 'helpers/address.helper';
import {
  getDayOfWeekLabel,
  getStoreHoursLabel,
} from 'helpers/storeHours.helper';
import { StoreId } from 'utils/constants';

const StyledHeader = styled(H3)({
  fontSize: '28px',
  fontWeight: 600,
  color: 'grey.600',
  marginBottom: '1.25rem',
});

interface FooterProps {
  initialStoreInfo?: IStore;
}

const Footer: FC<FooterProps> = ({ initialStoreInfo }) => {
  const { data: storeInfo, isLoading } = useQuery({
    queryKey: ['store', StoreId],
    queryFn: () => apiCaller.getStoreInfo(StoreId),
    // FIXME causing weird error saying
    // Query data cannot be undefined. Please make sure to return a value other than undefined from your query function. Affected query key: ["store","641ff62a1af60afc9423cbea"]
    initialData: initialStoreInfo ?? null,
  });
  // Set the initialData will prevent isLoading from being true, need to figure out another way to determine if the it is loading or not
  return (
    <footer>
      <Box bgcolor='grey.450'>
        {isLoading || storeInfo === null ? (
          <Skeleton
            variant='rectangular'
            height={500}
            width='100%'
            animation='wave'
          />
        ) : (
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
                          <item.icon
                            fontSize='inherit'
                            sx={{ color: 'white' }}
                          />
                        </IconButton>
                      </a>
                    ))}
                  </FlexBox>

                  <FlexBox gap={2} flexDirection='column'>
                    <FlexBox alignItems='center' color='grey.700' gap={1}>
                      <LocationOnIcon />
                      <Typography>{getFullAddress(storeInfo)}</Typography>
                    </FlexBox>

                    <FlexBox alignItems='center' color='grey.700' gap={1}>
                      <LocalPhone />
                      <Typography>
                        <a href='tel:0338758008'>{storeInfo.phone}</a>
                      </Typography>
                    </FlexBox>

                    <FlexBox alignItems='center' color='grey.700' gap={1}>
                      <EmailIcon />
                      <Typography>
                        <a href='mailto:n18dccn192@student.ptithcm.edu.vn'>
                          {storeInfo.email}
                        </a>
                      </Typography>
                    </FlexBox>
                  </FlexBox>

                  <FlexBox mt={5} alignItems='center' color='grey.600' gap={1}>
                    <CopyrightRounded />
                    <Typography>
                      2023 Bản quyền thuộc Công ty TNHH Nutribox. Tất cả các
                      quyền được bảo lưu
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
                    {storeInfo.storeHours.map((item, index) => (
                      <FlexBox key={index} justifyContent='space-between'>
                        <Typography color='grey.600'>
                          {getDayOfWeekLabel(item.dayOfWeek)}
                        </Typography>
                        <Typography color='grey.600'>
                          {getStoreHoursLabel(
                            new Date(item.openTime),
                            new Date(item.closeTime),
                          )}
                        </Typography>
                      </FlexBox>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Container>
        )}
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
