import type {
  CallbackWithoutResultAndOptionalError,
  SchemaDefinitionProperty,
} from 'mongoose';
import validator from 'validator';

import type {
  DuplicateKeyError,
  ValidationError,
} from 'api/types/mongooseError.type';
import { maskPhoneRegex, phoneRegex } from 'helpers/regex.helper';

export const getAddressSchema = (
  prefix: string,
): Record<string, SchemaDefinitionProperty<any>> => {
  return {
    province: {
      type: String,
      required: [true, `${prefix}/Province is required`],
      trim: true,
    },

    district: {
      type: String,
      required: [true, `${prefix}/District is required`],
      trim: true,
    },

    ward: {
      type: String,
      required: [true, `${prefix}/Ward is required`],
      trim: true,
    },

    streetAddress: {
      type: String,
      required: [true, `${prefix}/StreetAddress is required`],
      trim: true,
    },

    provinceId: {
      type: Number,
      required: [true, `${prefix}/ProvinceId is required`],
    },

    districtId: {
      type: Number,
      required: [true, `${prefix}/DistrictId is required`],
    },

    wardId: {
      type: Number,
      required: [true, `${prefix}/WardId is required`],
    },
  };
};

export const getEmailSchema = (
  prefix: string,
): Record<string, SchemaDefinitionProperty<any>> => {
  return {
    email: {
      type: String,
      required: [true, `${prefix}/Email is required}`],
      maxLength: [100, `${prefix}/Email should be at most 100 characters`],
      validate: {
        validator: validator.isEmail,
        message: `Invalid ${prefix}/Email format`,
      },
      unique: true,
      lowercase: true,
      trim: true,
    },
  };
};

export const getPhoneSchema = (
  prefix: string,
  unique = true,
): Record<string, SchemaDefinitionProperty<any>> => {
  return {
    phone: {
      type: String,
      required: [true, `${prefix}/Phone is required`],
      validate: {
        validator: (phone: string) => {
          const isValidPhoneFormat = phoneRegex.test(phone.replace(/-/g, ''));
          const isValidMaskPhoneFormat = maskPhoneRegex.test(phone);
          return isValidPhoneFormat && isValidMaskPhoneFormat;
        },
        message: `Invalid ${prefix}/Phone format`,
      },
      unique,
      trim: true,
    },
  };
};

export const getDuplicateKeyErrorMessage = (errorObj: DuplicateKeyError) => {
  const errorMessage: Record<string, string> = {};
  if (errorObj.code === 11000 && errorObj.keyValue) {
    const fields = Object.keys(errorObj.keyValue);
    const fieldName = fields[0];
    const fieldValue = errorObj.keyValue[fieldName];
    errorMessage[fieldName] = `${fieldName} ${fieldValue} đã tồn tại!`;
  } else {
    errorMessage.unknown = 'Đã xảy ra lỗi không xác định, vui lòng thử lại sau';
  }

  return errorMessage;
};

export const getValidationErrorMessages = (errorObj: ValidationError) => {
  const errorMessages: Record<string, string> = {};

  for (const fieldName in errorObj.errors) {
    if (Object.hasOwnProperty.call(errorObj.errors, fieldName)) {
      const error = errorObj.errors[fieldName];
      errorMessages[fieldName] = error.message;
    }
  }
  if (Object.keys(errorMessages).length === 0) {
    errorMessages.unknown =
      'Đã xảy ra lỗi không xác định, vui lòng thử lại sau';
  }

  return errorMessages;
};

export function preSaveWasNew(next: CallbackWithoutResultAndOptionalError) {
  this.wasNew = this.isNew;
  next();
}
