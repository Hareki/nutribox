import { SchemaDefinitionProperty } from 'mongoose';
import validator from 'validator';

import { phoneRegex } from 'helpers/regex';

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
): Record<string, SchemaDefinitionProperty<any>> => {
  return {
    phone: {
      type: String,
      required: [true, `${prefix}/Phone is required`],
      validate: {
        validator: (phone: string) => phoneRegex.test(phone),
        message: `Invalid ${prefix}/Phone format`,
      },
      unique: true,
      trim: true,
    },
  };
};
