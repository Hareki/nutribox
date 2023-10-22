import type { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import type { Dispatch } from 'react';

import type { JSFail } from 'backend/types/jsend';
import type { InfoDialogAction } from 'components/dialog/info-dialog/reducer';

export type AxiosErrorWithMessages = AxiosError<JSFail<any>>;

export const extractErrorMessages = (
  responseData: Record<string, string>,
  t: (key: string) => string,
  params?: string[],
): string[] => {
  try {
    const result = Object.keys(responseData).map((errorProperty) => {
      if (errorProperty === 'params') return null;

      let translatedMsg = t(responseData[errorProperty] || '');

      if (params) {
        params.forEach((param, index) => {
          const placeholder = `{${index}}`;
          translatedMsg = translatedMsg.replace(placeholder, param);
        });
      }

      return translatedMsg;
    });

    return result.filter(Boolean) as string[];
  } catch (err) {
    console.log('err', err);
    throw err;
  }
};

export type GetDefaultOnApiErrorInputs = {
  // error: AxiosErrorWithMessages;
  dispatch: Dispatch<InfoDialogAction>;
  operationName: string;
  t: (key: string) => string;
  onStart?: () => void;
};

export const getDefaultOnApiError =
  ({
    dispatch,
    // error,
    operationName,
    t,
    onStart,
  }: GetDefaultOnApiErrorInputs) =>
  (error: AxiosErrorWithMessages) => {
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

// export const getDefaultOnApiError =
//   (
//     { operationName, onDone }: GetDefaultOnApiErrorInputs,
//     t: (key: string) => string,
//   ) =>
//   (error: AxiosError) => {
//     const responseData = error.response?.data as Record<string, string>;

//     if (!responseData) {
//       enqueueSnackbar(
//         `Đã xảy ra lỗi khi ${operationName}, vui lòng thử lại sau`,
//         {
//           variant: 'error',
//         },
//       );
//       onDone?.();
//       return;
//     }

//     extractErrorMessages(responseData, t).map((message) => {
//       enqueueSnackbar(message, {
//         variant: 'error',
//       });
//     });
//     onDone?.();
//   };

export const notifyUnexpectedError = () =>
  enqueueSnackbar('Đã có lỗi xảy ra, vui lòng thử lại sau', {
    variant: 'error',
  });
