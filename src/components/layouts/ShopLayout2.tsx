// Shop Layout 1 Previously
import { FC, Fragment, ReactNode } from 'react';

import StickyScroll from 'components/abstract/StickyScroll';
import { Footer } from 'components/common/layout/footer';
import Header from 'components/common/layout/header/Header';
import Navbar from 'components/common/layout/navbar/Navbar';
import Topbar from 'components/common/layout/Topbar';
import { MobileNavigationBar } from 'components/mobile-navigation';
import SearchInputWithCategory from 'components/search-box/SearchInputWithCategory';

/**
 *  Used in:
 *  1. product details page
 *  2. order-confirmation page
 *  3. product-search page
 *  4. checkoutNavLayout and CustomerDashboardLayout component
 */

// ===================================================
type ShopLayout2Props = {
  children: ReactNode;
  showTopbar?: boolean;
  showNavbar?: boolean;
  topbarBgColor?: string;
};
// ===================================================

const ShopLayout2: FC<ShopLayout2Props> = ({
  children,
  topbarBgColor,
  showTopbar = true,
  showNavbar = true,
}) => {
  return (
    <Fragment>
      {/* TOPBAR */}
      {showTopbar && <Topbar bgColor={topbarBgColor} />}

      {/* HEADER */}
      <StickyScroll>
        <Header searchInput={<SearchInputWithCategory />} />
      </StickyScroll>

      <div className='section-after-sticky'>
        {/* NAVIGATION BAR */}
        {showNavbar && <Navbar elevation={0} border={1} />}

        {/* BODY CONTENT */}
        {children}
      </div>

      {/* SMALL DEVICE BOTTOM NAVIGATION */}
      <MobileNavigationBar />

      {/* FOOTER */}
      <Footer />
    </Fragment>
  );
};

export default ShopLayout2;
