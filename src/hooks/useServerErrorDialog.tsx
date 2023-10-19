import { useReducer } from 'react';

import { useCustomTranslation } from './useCustomTranslation';

import InfoDialog from 'components/dialog/info-dialog';
import {
  infoDialogReducer,
  initInfoDialogState,
} from 'components/dialog/info-dialog/reducer';
import { extractErrorMessages } from 'helpers/error.helper';

type ServerSideErrorDialogProps = {
  title: string;
  namespaces: string[];
  onClose?: () => void;
};
export const useServerSideErrorDialog = ({
  namespaces,
  onClose,
  title,
}: ServerSideErrorDialogProps) => {
  const { t } = useCustomTranslation(namespaces);
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

  const dispatchErrorDialog = (error: Record<string, string>) => {
    const messagesObject = error;

    try {
      dispatch({
        type: 'open_dialog',
        payload: {
          variant: 'error',
          title,
          content: extractErrorMessages(messagesObject, t),
        },
      });
    } catch (error) {
      console.log('unexpected error:', error);
    }
  };

  return { errorDialog: ErrorDialog, dispatchErrorDialog, t };
};
