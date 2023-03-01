import { NextPage } from 'next';

import { FlexRowCenter } from 'components/flex-box';
import SEO from 'components/SEO';
import Signup from 'pages-sections/sessions/Signup';

const SignUpPage: NextPage = () => {
  return (
    <FlexRowCenter flexDirection='column' minHeight='100vh'>
      <SEO title='Sign up' />
      <Signup />
    </FlexRowCenter>
  );
};

export default SignUpPage;
