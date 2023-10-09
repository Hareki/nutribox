// JSend response specification
export interface JSSuccess<T> {
  status: 'success';
  data: T;
}

export interface JSFail<T> {
  status: 'fail';
  data?: Partial<Record<keyof T, string>>;
}

export interface JSError {
  status: 'error';
  message?: string;
  code?: number;
}

export type JSendResponse<T> = JSSuccess<T> | JSFail<T> | JSError;
