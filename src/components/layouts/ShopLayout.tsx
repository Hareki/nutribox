import { Box } from '@mui/material';
import { FC, Fragment, ReactNode, useCallback, useState } from 'react';

import Header from 'components/header/Header';
import Navbar from 'components/navbar/Navbar';
import SearchInput from 'components/search-box/SearchInput';
import Sticky from 'components/Sticky';
import Topbar from 'components/Topbar';

/**
 *  Used in:
 *  1. grocery1, grocery2, healthbeauty-shop
 *  2. checkout-alternative
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
  const [isFixed, setIsFixed] = useState(false);
  const toggleIsFixed = useCallback((fixed: boolean) => setIsFixed(fixed), []);

  return (
    <Fragment>
      {/* TOPBAR */}
      {showTopbar && <Topbar />}

      {/* HEADER */}
      <Sticky fixedOn={0} onSticky={toggleIsFixed} scrollDistance={70}>
        <Header isFixed={isFixed} searchInput={<SearchInput />} />
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

export default ShopLayout;