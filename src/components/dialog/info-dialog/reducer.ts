import type { InfoDialogProps } from '.';

export interface InfoDialogState extends Omit<InfoDialogProps, 'handleClose'> {}

interface OpenDialogAction {
  type: 'open_dialog';
  payload: Omit<InfoDialogProps, 'handleClose' | 'open'>;
}

interface CloseDialogAction {
  type: 'close_dialog';
}

export type InfoDialogAction = OpenDialogAction | CloseDialogAction;

export const infoDialogReducer = (
  state: InfoDialogState,
  action: InfoDialogAction,
): InfoDialogState => {
  switch (action.type) {
    case 'open_dialog':
      return {
        ...state,
        open: true,
        variant: action.payload.variant,
        title: action.payload.title,
        content: action.payload.content,
      };
    case 'close_dialog':
      return { ...state, open: false };
    default:
      return state;
  }
};

export const initInfoDialogState: InfoDialogState = {
  open: false,
  variant: 'info',
  title: '',
  content: '',
};
