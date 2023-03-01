import Script from 'next/script';
import React from 'react';

const GoogleAnalytics: React.FC = () => {
  return (
    <React.Fragment>
      {/* Google analytics */}
      <Script
        src='https://www.googletagmanager.com/gtag/js?id=G-FLCDXWTVMD'
        strategy='lazyOnload'
      />
      <Script
        id='google-analytics'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-FLCDXWTVMD');
    `,
        }}
      />
    </React.Fragment>
  );
};

export default GoogleAnalytics;
