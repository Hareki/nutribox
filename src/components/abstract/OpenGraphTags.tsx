import React from 'react';

const OpenGraphTags: React.FC = () => {
  return (
    <React.Fragment>
      <meta property='og:url' content='https://nutribox.vercel.app/' />
      {/* thumbnail And title for social media */}
      <meta property='og:type' content='website' />
      <meta property='og:title' content='Nutribox' />
      <meta
        property='og:description'
        content='Website mua bán thực phẩm tươi sống và nhu yếu phẩm'
      />
      <meta property='og:image' content='/assets/images/landing/preview.png' />
    </React.Fragment>
  );
};

export default OpenGraphTags;
