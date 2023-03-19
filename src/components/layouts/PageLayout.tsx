import type { ReactNode, FC, ReactElement } from 'react';

import ShopLayout1 from './ShopLayout1';

import { Footer } from 'components/common/layout/footer';

type Props = { children: ReactNode };
const PageLayout: FC<Props> = ({ children }) => {
  return (
    <ShopLayout1 showNavbar={false} showTopbar={false}>
      {children}
      <Footer />
    </ShopLayout1>
  );
};

export const getPageLayout = (page: ReactElement) => (
  <PageLayout>{page}</PageLayout>
);

export default PageLayout;
