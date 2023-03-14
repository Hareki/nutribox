// Shop Layout 1 Previously
import { FC, Fragment, ReactNode } from 'react';

import { Footer } from 'components/footer';
import Header from 'components/header/Header';
import { MobileNavigationBar } from 'components/mobile-navigation';
import Navbar from 'components/navbar/Navbar';
import SearchInputWithCategory from 'components/search-box/SearchInputWithCategory';
import StickyScroll from 'components/StickyScroll';
import Topbar from 'components/Topbar';

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
