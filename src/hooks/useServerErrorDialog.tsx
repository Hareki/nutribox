import { enqueueSnackbar } from 'notistack';
import { useReducer } from 'react';

import InfoDialog from 'components/dialog/info-dialog';
import {
  infoDialogReducer,
  initInfoDialogState,
} from 'components/dialog/info-dialog/reducer';
import type { AxiosErrorWithMessages } from 'helpers/error.helper';
import { extractErrorMessages } from 'helpers/error.helper';

type ServerSideErrorDialogProps = {
  t: (key: string) => string;
  operationName: string;
  onStart?: () => void;
  onClose?: () => void;
};
export const useServerSideErrorDialog = ({
  t,
  onClose,
  onStart,
  operationName,
}: ServerSideErrorDialogProps) => {
  const [state, dispatch] = useReducer(infoDialogReducer, initInfoDialogState);

  const ErrorDialog = () => (
    <InfoDialog
      variant={state.variant}
      open={state.open}
      handleClose={() => {
        dispatch({ type: 'close_dialog' });
        onClose?.();
      }}
      title={state.title}
      content={state.content}
    />
  );

  const dispatchErrorDialog = (error: AxiosErrorWithMessages) => {
    onStart?.();

    if (error.response?.data.data) {
      const messageObject = error.response.data.data;
      dispatch({
        type: 'open_dialog',
        payload: {
          variant: 'error',
          title: `${operationName} thất bại`,
          content: extractErrorMessages(
            messageObject,
            t,
            error.response.data.data.params,
          ),
        },
      });
      return;
    }
    enqueueSnackbar(`Đã xảy ra lỗi không xác định, vui lòng thử lại sau`, {
      variant: 'error',
    });
  };

  return { ErrorDialog, dispatchErrorDialog };
};
