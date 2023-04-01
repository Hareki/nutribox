import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { useReducer, useState } from 'react';

import ConfirmDialog from 'components/dialog/confirm-dialog';
import { confirmDialogReducer } from 'components/dialog/confirm-dialog/reducer';

const useSignOutDialog = () => {
  const router = useRouter();
  const [confirmState, dispatchConfirm] = useReducer(confirmDialogReducer, {
    open: false,
  });
  const [isRedirecting, setIsRedirecting] = useState(false);

  const dialog = (
    <ConfirmDialog
      title='Đăng xuất'
      content='Bạn có chắc chắn muốn đăng xuất?'
      open={confirmState.open}
      isLoading={isRedirecting}
      handleCancel={() => dispatchConfirm({ type: 'cancel_dialog' })}
      handleConfirm={async () => {
        await signOut({ redirect: false });
        setIsRedirecting(true);
        router.replace('/login');
      }}
    />
  );
  return { dialog, dispatchConfirm };
};
export default useSignOutDialog;
