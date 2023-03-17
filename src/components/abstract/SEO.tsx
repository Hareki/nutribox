import Head from 'next/head';
import type { FC } from 'react';

// ====================================================================
type SEOProps = {
  title: string;
  sitename?: string;
  description?: string;
};
// ====================================================================

const SEO: FC<SEOProps> = ({
  title,
  description,
  sitename = 'Nutribox - Bữa ăn dinh dưỡng tốt cho sức khoẻ!',
}) => {
  return (
    <Head>
      <title>{`${title} | ${sitename}`}</title>
      <meta name='description' content={description} />
    </Head>
  );
};

export default SEO;
