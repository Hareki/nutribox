// Shop Layout 2 Previously
import { Box } from '@mui/material';
import { FC, Fragment, ReactNode, useCallback, useState } from 'react';

import Header from 'components/header/Header';
import Navbar from 'components/navbar/Navbar';
import SearchInput from 'components/search-box/SearchInput';
import Sticky from 'components/Sticky';
import Topbar from 'components/Topbar';

/**
 *  Used in:
 *  1. checkout-alternative
 */

// =======================================================
type ShopLayout1Props = {
  children: ReactNode;
  showNavbar?: boolean;
  showTopbar?: boolean;
};
// =======================================================

const ShopLayout1: FC<ShopLayout1Props> = ({
  children,
  showTopbar = true,
  showNavbar = true,
}) => {
  const [isFixed, setIsFixed] = useState(false);
  const toggleIsFixed = useCallback((fixed: boolean) => setIsFixed(fixed), []);

  return (
    <Fragment>
      {/* TOPBAR */}
      {showTopbar && <Topbar />}

      {/* HEADER */}
      <Sticky fixedOn={0} onSticky={toggleIsFixed} scrollDistance={70}>
        <Header searchInput={<SearchInput />} />
      </Sticky>

      <Box zIndex={4} position='relative' className='section-after-sticky'>
        {/* NAVIGATION BAR */}
        {showNavbar && <Navbar elevation={0} />}

        {/* BODY CONTENT */}
        {children}
      </Box>
    </Fragment>
  );
};

export default ShopLayout1;
