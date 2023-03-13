import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useReducer, useState } from 'react';

import { FlexRowCenter } from 'components/flex-box';
import InfoDialog from 'components/InfoDialog';
import { infoDialogReducer } from 'components/InfoDialog/reducer';
import SEO from 'components/SEO';
import { getMessageList } from 'helpers/feedback.helper';
import Signup from 'pages-sections/sessions/Signup';
import apiCaller from 'utils/apiCallers/signup';

export interface SignUpRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

const SignUpPage: NextPage = () => {
  const [state, dispatch] = useReducer(infoDialogReducer, {
    open: false,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFormSubmit = async (values: SignUpRequestBody) => {
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
