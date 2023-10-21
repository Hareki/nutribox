import { z } from 'zod';

import {
  DATE_REGEX,
  MASK_PHONE_REGEX,
  PHONE_REGEX,
} from 'constants/regex.constant';
export type RefinementParameters<T> = [
  (data: T) => boolean,
  { message: string; path: string[] },
];

export const zodString = (
  prefix: string,
  min = 1,
  max = Number.MAX_SAFE_INTEGER,
) => {
  return z
    .string({
      required_error: `${prefix}.Required`,
    })
    .min(min, {
      message: `${prefix}.Min`,
    })
    .max(max, {
      message: `${prefix}.Max`,
    });
};

export const zodUuid = (prefix: string) =>
  z
    .string({
      required_error: `${prefix}.Required`,
    })
    .uuid();

export const zodDate = (prefix: string) =>
  z
    .date({
      required_error: `${prefix}.Required`,
    })
    .or(
      z
        .string({
          required_error: `${prefix}.Required`,
        })
        .regex(DATE_REGEX, {
          message: `${prefix}.InvalidFormat`,
        }),
    )
    .refine(
      (data) => {
        const date = new Date(data);
        return !isNaN(date.getTime());
      },
      {
        message: `${prefix}.InvalidFormat`,
      },
    )
    .transform((data) => new Date(data));

export const zodNumber = (
  prefix: string,
  type: 'int' | 'float' = 'int',
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
) =>
  z
    .number({
      required_error: `${prefix}.Required`,
    })
    .int(type === 'int' ? { message: `${prefix}.InvalidFormat` } : undefined)
    .min(min, {
      message: `${prefix}.Min`,
    })
    .max(max, {
      message: `${prefix}.Max`,
    })
    .or(
      z
        .string({
          required_error: `${prefix}.Required`,
        })
        .refine(
          (data) => {
            const number = Number(data);
            return !isNaN(number);
          },
          {
            message: `${prefix}.InvalidFormat`,
          },
        )
        .refine(
          (data) => {
            const number = Number(data);
            return number >= min;
          },
          {
            message: `${prefix}.Min`,
          },
        )
        .refine(
          (data) => {
            const number = Number(data);
            return number <= max;
          },
          {
            message: `${prefix}.Max`,
          },
        ),
    )
    .transform((data) => Number(data));

export const zodPassword = (prefix: string) =>
  zodString(prefix, 6, 50).refine(
    (password) => {
      const hasUppercase = /[A-Z]/.test(password);

      // eslint-disable-next-line no-useless-escape
      const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
        password,
      );

      return hasUppercase && hasSpecialCharacter;
    },
    {
      message: `${prefix}.InvalidFormat`,
    },
  );

export const zodPhone = (prefix: string) =>
  zodString(prefix, 1, 50)
    .refine(
      (value) => MASK_PHONE_REGEX.test(value) || PHONE_REGEX.test(value),
      {
        message: `${prefix}.InvalidFormat`,
      },
    )
    .transform((value) => {
      return value.replace(/-/g, '');
    });
