import type { ReactNode, FC, ReactElement } from 'react';

import ShopLayout from './ShopLayout';

import { Footer } from 'components/common/layout/footer';

export const getPageLayout = (page: ReactElement) => (
  <PageLayout>{page}</PageLayout>
);

type Props = { children: ReactNode };
const PageLayout: FC<Props> = ({ children }) => {
  return (
    <ShopLayout showNavbar={false} showTopbar={false}>
      {children}
      <Footer />
    </ShopLayout>
  );
};

export default PageLayout;
