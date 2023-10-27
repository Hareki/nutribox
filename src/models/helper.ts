import { isAfter, isBefore, isEqual, startOfDay } from 'date-fns';
import { z } from 'zod';

import {
  DATE_REGEX,
  MASK_PHONE_REGEX,
  PHONE_REGEX,
} from 'constants/regex.constant';
import { getUtcDate } from 'utils/date.helper';
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

export const zodDate = (
  prefix: string,
  minDate?: Date,
  maxDate?: Date,
  ignoreTime = true,
) =>
  z
    .date({
      errorMap: (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_union) {
          return { message: `${prefix}.Required` };
        }

        const issues = [
          z.ZodIssueCode.invalid_date,
          z.ZodIssueCode.invalid_type,
          z.ZodIssueCode.invalid_string,
        ];

        if (issues.includes(issue.code as any)) {
          return { message: `${prefix}.InvalidFormat` };
        }

        return { message: ctx.defaultError };
      },
    })
    .or(
      z
        .string()
        .regex(DATE_REGEX, {
          message: `${prefix}.InvalidFormat`,
        })
        .refine(
          (data) => {
            const date = new Date(data);
            return !isNaN(date.getTime());
          },
          {
            message: `${prefix}.InvalidFormat`,
          },
        ),
    )
    .transform((data) => {
      if (ignoreTime) {
        return startOfDay(getUtcDate(data));
      }
      return getUtcDate(data);
    })
    .refine(
      (data) => {
        if (minDate) {
          const date = new Date(data);
          return (
            isAfter(date, startOfDay(minDate)) ||
            isEqual(date, startOfDay(minDate))
          );
        }
        return true;
      },
      {
        message: `${prefix}.Min`,
      },
    )
    .refine(
      (data) => {
        if (maxDate) {
          const date = new Date(data);
          return (
            isBefore(date, startOfDay(maxDate)) ||
            isEqual(date, startOfDay(maxDate))
          );
        }
        return true;
      },
      {
        message: `${prefix}.Max`,
      },
    );

export const zodNumber = (
  prefix: string,
  type: 'int' | 'float' = 'int',
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
) =>
  z
    .number({
      errorMap: (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_union) {
          return { message: `${prefix}.Required` };
        }
        return { message: ctx.defaultError };
      },
    })
    .int(type === 'int' ? { message: `Number.InvalidFormat` } : undefined)
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
            message: `Number.InvalidFormat`,
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
