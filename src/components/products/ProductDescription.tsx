import { Box } from '@mui/material';
import type { FC } from 'react';

import { H3 } from 'components/abstract/Typography';

// ======================================================
type ProductDescriptionProps = {};
// ======================================================

const ProductDescription: FC<ProductDescriptionProps> = () => {
  return (
    <Box>
      <H3 mb={2}>Specification:</H3>
      <Box>
        Brand: Beats <br />
        Model: S450 <br />
        Wireless Bluetooth Headset <br />
        FM Frequency Response: 87.5 – 108 MHz <br />
        Feature: FM Radio, Card Supported (Micro SD / TF) <br />
        Made in China <br />
      </Box>
    </Box>
  );
};

export default ProductDescription;
