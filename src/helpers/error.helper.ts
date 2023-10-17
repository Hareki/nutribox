import type { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';

import type { GeneralFunction } from 'types/common';

export const extractErrorMessages = (
  responseData: Record<string, string>,
  t: (key: string) => string,
): string[] => {
  const result = Object.keys(responseData).map(
    (errorProperty) => `${t(responseData[errorProperty] || '')}`,
  );
  return result.filter(Boolean);
};

export type GetDefaultOnApiErrorInputs = {
  operationName: string;
  onDone?: GeneralFunction;
};
export const getDefaultOnApiError =
  (
    { operationName, onDone }: GetDefaultOnApiErrorInputs,
    t: (key: string) => string,
  ) =>
  (error: AxiosError) => {
    const responseData = error.response?.data as Record<string, string>;

    if (!responseData) {
      enqueueSnackbar(
        `Đã xảy ra lỗi khi ${operationName}, vui lòng thử lại sau`,
        {
          variant: 'error',
        },
      );
      onDone?.();
      return;
    }

    extractErrorMessages(responseData, t).map((message) => {
      enqueueSnackbar(message, {
        variant: 'error',
      });
    });
    onDone?.();
  };

export const notifyUnexpectedError = () =>
  enqueueSnackbar('Đã có lỗi xảy ra, vui lòng thử lại sau', {
    variant: 'error',
  });
