import { Button, Container, styled } from '@mui/material';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';

import { AccountService } from 'backend/services/account/account.service';
import SEO from 'components/abstract/SEO';
import { H1, Paragraph } from 'components/abstract/Typography';
import BazaarCard from 'components/common/BazaarCard';
import { FlexBox } from 'components/flex-box';
import { getPageLayout } from 'components/layouts/PageLayout';
import LazyImage from 'components/LazyImage';
import { SIGN_IN_ROUTE } from 'constants/routes.ui.constant';

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

VerificationResult.getLayout = getPageLayout;

interface VerificationProps {
  verified: boolean;
}

function VerificationResult({ verified }: VerificationProps) {
  const router = useRouter();
  const [buttonContent, setButtonContent] = useState('Tới trang đăng nhập');
  const [isRedirecting, setRedirecting] = useState(false);

  return (
    <Fragment>
      <SEO title={verified ? 'Xác thực thành công' : 'Xác thực thất bại'} />

      <Container sx={{ mt: 6, mb: 20 }}>
        <Wrapper>
          <LazyImage
            width={116}
            height={116}
            alt='complete'
            src={
              verified
                ? '/assets/images/illustrations/party-popper.svg'
                : '/assets/images/logos/shopping-bag.svg'
            }
          />
          <H1 lineHeight={1.1} mt='1.5rem'>
            {verified ? 'Xác thực thành công' : 'Xác thực thất bại'}
          </H1>

          <Paragraph color='grey.800' mt='0.3rem'>
            {verified
              ? 'Bạn giờ có thể đăng nhập vào tài khoản đã đăng ký'
              : 'Đường dẫn đã hết hạn hoặc không tồn tại'}
          </Paragraph>

          {verified && (
            <FlexBox gap={2} justifyContent='center'>
              <StyledButton
                disabled={isRedirecting}
                onClick={() => {
                  setButtonContent('Đang chuyển hướng...');
                  setRedirecting(true);
                  router.replace(SIGN_IN_ROUTE);
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
  let verified = true;
  const token = context.query.token as string;
  try {
    await AccountService.verifyEmail(token);
  } catch (error) {
    verified = false;
  }

  return {
    props: {
      verified,
    },
  };
};

export default VerificationResult;
