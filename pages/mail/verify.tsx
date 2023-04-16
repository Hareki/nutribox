import { Button, Container, styled } from '@mui/material';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';

import { verifyAccount } from 'api/base/server-side-modules';
import connectToDB from 'api/database/databaseConnection';
import SEO from 'components/abstract/SEO';
import { H1, Paragraph } from 'components/abstract/Typography';
import BazaarCard from 'components/common/BazaarCard';
import { FlexBox } from 'components/flex-box';
import { getPageLayout } from 'components/layouts/PageLayout';
import LazyImage from 'components/LazyImage';

const Wrapper = styled(BazaarCard)({
  margin: 'auto',
  padding: '3rem',
  maxWidth: '630px',
  textAlign: 'center',
});

const StyledButton = styled(Button)({
  marginTop: '2rem',
  padding: '8px 16px',
});

Verification.getLayout = getPageLayout;

interface VerificationProps {
  success: boolean;
}

function Verification({ success }: VerificationProps) {
  const router = useRouter();
  const [buttonContent, setButtonContent] = useState('Tới trang đăng nhập');
  const [isRedirecting, setRedirecting] = useState(false);

  return (
    <Fragment>
      <SEO title={success ? 'Xác thực thành công' : 'Xác thực thất bại'} />

      <Container sx={{ mt: 6, mb: 20 }}>
        <Wrapper>
          <LazyImage
            width={116}
            height={116}
            alt='complete'
            src={
              success
                ? '/assets/images/illustrations/party-popper.svg'
                : '/assets/images/logos/shopping-bag.svg'
            }
          />
          <H1 lineHeight={1.1} mt='1.5rem'>
            {success ? 'Xác thực thành công' : 'Xác thực thất bại'}
          </H1>

          <Paragraph color='grey.800' mt='0.3rem'>
            {success
              ? 'Bạn giờ có thể đăng nhập vào tài khoản đã đăng ký'
              : 'Đường dẫn đã hết hạn hoặc không tồn tại'}
          </Paragraph>

          {success && (
            <FlexBox gap={2} justifyContent='center'>
              <StyledButton
                disabled={isRedirecting}
                onClick={() => {
                  setButtonContent('Đang chuyển hướng...');
                  setRedirecting(true);
                  router.replace('/login');
                }}
                color='primary'
                disableElevation
                variant='contained'
                className='button-link'
              >
                {buttonContent}
              </StyledButton>
            </FlexBox>
          )}
        </Wrapper>
      </Container>
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  await connectToDB();
  const { token } = context.query;
  const success = await verifyAccount(token as string);
  return {
    props: {
      success,
    },
  };
};

export default Verification;
