import { Box, Button, Card, TextField } from '@mui/material';
import { NextPage } from 'next';
import Link from 'next/link';

import { FlexBox, FlexRowCenter } from 'components/flex-box';
import SEO from 'components/SEO';
import { H1, H6 } from 'components/Typography';

const ResetPassword: NextPage = () => {
  return (
    <FlexRowCenter flexDirection='column' minHeight='100vh'>
      <SEO title='Reset Password' />

      <Card sx={{ padding: 4, maxWidth: 600, marginTop: 4, boxShadow: 1 }}>
        <H1 fontSize={20} fontWeight={700} mb={4} textAlign='center'>
          Reset your password
        </H1>

        <FlexBox justifyContent='space-between' flexWrap='wrap' my={2}>
          <form style={{ width: '100%' }}>
            <TextField
              fullWidth
              name='email'
              type='email'
              label='Email'
              //   onBlur={handleBlur}
              //   value={values.email}
              //   onChange={handleChange}
              //   error={Boolean(touched.email && errors.email)}
              //   helperText={touched.email && errors.email}
            />

            <Box sx={{ mt: 2 }}>
              <Button
                fullWidth
                type='submit'
                color='primary'
                variant='contained'
              >
                Reset
              </Button>
            </Box>
          </form>

          <FlexRowCenter mt='1.25rem' justifyContent='center' width='100%'>
            <Box>Don&apos;t have account?</Box>
            <Link href='/signup' passHref legacyBehavior>
              <a>
                <H6 ml={1} borderBottom='1px solid' borderColor='grey.900'>
                  Sign Up
                </H6>
              </a>
            </Link>
          </FlexRowCenter>
        </FlexBox>
      </Card>
    </FlexRowCenter>
  );
};

export default ResetPassword;
