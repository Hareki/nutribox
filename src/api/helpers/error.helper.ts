export class CustomError extends Error {
  public code: CustomErrorCodes;
  constructor(message: string, code: CustomErrorCodes) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
  }
}

export enum CustomErrorCodes {
  DOCUMENT_NOT_FOUND,
  PRODUCT_NOT_BELONG_TO_CART_ITEM,
}
