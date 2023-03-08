interface JSendSuccessResponse<T> {
  status: 'success';
  data: T;
}

interface JSendErrorResponse {
  status: 'error';
  message: string;
  code?: number;
}

interface JSendFailResponse<T> {
  status: 'fail';
  data: T;
}

export type JSendResponse<T> =
  | JSendSuccessResponse<T>
  | JSendErrorResponse
  | JSendFailResponse<T>;
