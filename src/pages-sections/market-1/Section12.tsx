import { Container, Grid, IconButton } from '@mui/material';
import React, { FC } from 'react';

import BazaarCard from 'components/BazaarCard';
import appIcons from 'components/icons';
import { H4, Span } from 'components/Typography';
import Service from 'models/Service.model';

const CARD_STYLE = {
  p: '3rem',
  height: '100%',
  display: 'flex',
  borderRadius: '8px',
  alignItems: 'center',
  flexDirection: 'column',
};

// ==================================================
type Props = { serviceList: Service[] };
// ==================================================

const Section12: FC<Props> = ({ serviceList }) => {
  return (
    <Container sx={{ mb: '70px' }}>
      <Grid container spacing={3}>
        {serviceList.map((item, ind) => {
          const Icon = appIcons[item.icon];
          return (
            <Grid item lg={3} md={6} xs={12} key={item.id}>
              <BazaarCard hoverEffect sx={CARD_STYLE}>
                <IconButton
                  sx={{
                    width: 64,
                    height: 64,
                    fontSize: '1.75rem',
                    backgroundColor: 'grey.200',
                  }}
                >
                  <Icon fontSize='inherit' />
                </IconButton>

                <H4 mt={2.5} mb={1.25} textAlign='center'>
                  {item.title}
                </H4>

                <Span textAlign='center' color='grey.600'>
                  We offer competitive prices on our 100 million plus product
                  any range.
                </Span>
              </BazaarCard>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Section12;
