// Shop Layout 2 Previously
import { Box } from '@mui/material';
import type { FC, ReactNode } from 'react';
import { Fragment } from 'react';

import StickyScroll from 'components/abstract/StickyScroll';
import Header from 'components/common/layout/header/Header';
import Navbar from 'components/common/layout/navbar/Navbar';
import Topbar from 'components/common/layout/Topbar';
import SearchInput from 'components/search-box/SearchInput';

/**
 *  Used in:
 *  1. checkout-alternative
 */

// =======================================================
type ShopLayoutProps = {
  children: ReactNode;
  showNavbar?: boolean;
  showTopbar?: boolean;
};
// =======================================================

const ShopLayout: FC<ShopLayoutProps> = ({
  children,
  showTopbar = true,
  showNavbar = true,
}) => {
  return (
    <Fragment>
      {/* TOPBAR */}
      {showTopbar && <Topbar />}

      {/* HEADER */}
      <StickyScroll>
        <Header searchInput={<SearchInput />} />
      </StickyScroll>

      <Box zIndex={4} position='relative' className='section-after-sticky'>
        {/* NAVIGATION BAR */}
        {showNavbar && <Navbar elevation={0} />}

        {/* BODY CONTENT */}
        {children}
      </Box>
    </Fragment>
  );
};

export default ShopLayout;
