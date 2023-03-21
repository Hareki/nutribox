import type { ReactNode, FC, ReactElement } from 'react';

import ShopLayout1 from './ShopLayout1';

import { Footer } from 'components/common/layout/footer';

export const getPageLayout = (page: ReactElement) => (
  <PageLayout>{page}</PageLayout>
);

type Props = { children: ReactNode };
const PageLayout: FC<Props> = ({ children }) => {
  return (
    <ShopLayout1 showNavbar={false} showTopbar={false}>
      {children}
      <Footer />
    </ShopLayout1>
  );
};

export default PageLayout;
