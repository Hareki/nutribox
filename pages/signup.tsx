import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useReducer, useState } from 'react';

import type { SignUpRequestBody } from './api/signup';

import SEO from 'components/abstract/SEO';
import InfoDialog from 'components/dialog/info-dialog';
import { infoDialogReducer } from 'components/dialog/info-dialog/reducer';
import { FlexRowCenter } from 'components/flex-box';
import { getMessageList } from 'helpers/feedback.helper';
import Signup from 'pages-sections/auth/Signup';
import apiCaller from 'utils/apiCallers/signup';



const SignUpPage: NextPage = () => {
  const [state, dispatch] = useReducer(infoDialogReducer, {
    open: false,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFormSubmit = async (values: SignUpRequestBody) => {
    console.log('file: signup.tsx:30 - handleFormSubmit - values:', values);
    setLoading(true);
    const result = await apiCaller.signUp(values);
    setLoading(false);
    if (result.status === 'fail') {
      const messagesObject = result.data;
      dispatch({
        type: 'open_dialog',
        payload: {
          variant: 'error',
          title: 'Đăng ký thất bại',
          content: getMessageList(messagesObject),
        },
      });
    } else {
      dispatch({
        type: 'open_dialog',
        payload: {
          variant: 'info',
          title: 'Đăng ký thành công',
          content:
            'Vui lòng kiểm tra email để kích hoạt tài khoản, bạn sẽ được chuyển hướng về trang đăng nhập sau khi tắt thông báo này',
        },
      });
    }
  };

  return (
    <>
      <FlexRowCenter flexDirection='column' minHeight='100vh'>
        <SEO title='Sign up' />
        <Signup loading={loading} handleFormSubmit={handleFormSubmit} />
      </FlexRowCenter>

      <InfoDialog
        variant={state.variant}
        open={state.open}
        handleClose={() => {
          dispatch({ type: 'close_dialog' });
          router.push('/login');
        }}
        title={state.title}
        content={state.content}
      />
    </>
  );
};

export default SignUpPage;
