export interface JSendSuccessResponse<T> {
  status: 'success';
  data: T;
}

export interface JSendFailResponse<T> {
  status: 'fail';
  data?: T;
  message?: string;
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
