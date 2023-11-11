import type { ConfirmDialogProps } from '.';

export interface ConfirmDialogState
  extends Omit<
    ConfirmDialogProps,
    'handleConfirm' | 'handleCancel' | 'isLoading'
  > {}

interface OpenDialogAction {
  type: 'open_dialog';
  payload?: Omit<ConfirmDialogProps, 'handleConfirm' | 'handleCancel' | 'open'>;
}

interface CancelDialog {
  type: 'cancel_dialog';
}

interface ConfirmDialog {
  type: 'confirm_dialog';
}

export type ConfirmDialogAction =
  | OpenDialogAction
  | CancelDialog
  | ConfirmDialog;

export const confirmDialogReducer = (
  state: ConfirmDialogState,
  action: ConfirmDialogAction,
): ConfirmDialogState => {
  switch (action.type) {
    case 'open_dialog':
      return {
        ...state,
        open: true,
        title: action.payload?.title || '',
        content: action.payload?.content,
      };
    case 'cancel_dialog':
      return { ...state, open: false };
    case 'confirm_dialog':
      return { ...state, open: false };
    default:
      return state;
  }
};

export const initConfirmDialogState: ConfirmDialogState = {
  open: false,
  title: '',
  content: '',
};
