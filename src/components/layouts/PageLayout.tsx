import type { ReactNode, FC, ReactElement } from 'react';

import ShopLayout from './ShopLayout';

import { Footer } from 'components/common/layout/footer';

const BasePageLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ShopLayout showNavbar={false} showTopbar={false}>
      {children}
    </ShopLayout>
  );
};

type Props = { children: ReactNode };
const PageLayout: FC<Props> = ({ children }) => {
  return (
    <BasePageLayout>
      {children}
      <Footer />
    </BasePageLayout>
  );
};

export const getPageLayout = (page: ReactElement) => {
  const name = (page.type as any).name;
  if (name === 'HomePage' || name === 'ProductDetails') {
    return <BasePageLayout>{page}</BasePageLayout>;
  }
  return <PageLayout>{page}</PageLayout>;
};

export default PageLayout;
