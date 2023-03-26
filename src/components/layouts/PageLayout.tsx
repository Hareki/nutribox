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
  const haveOwnFooter = (page.type as any).haveOwnFooter;
  if (haveOwnFooter) {
    return <BasePageLayout>{page}</BasePageLayout>;
  }
  return <PageLayout>{page}</PageLayout>;
};

export default PageLayout;
