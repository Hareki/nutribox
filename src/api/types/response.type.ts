interface JSendSuccessResponse<T> {
  status: 'success';
  data: T;
}

interface JSendFailResponse<T> {
  status: 'fail';
  data: T;
}

export interface JSendErrorResponse {
  status: 'error';
  message: string;
  code?: number;
  // data?: any;
}

export type JSendResponse<T> =
  | JSendSuccessResponse<T>
  | JSendFailResponse<T>
  | JSendErrorResponse;
