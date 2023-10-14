// Valid prefix: +84,03, 05, 07, 08, 09
// Main part: exact 8 numbers
export const PHONE_REGEX = /^(((\+|)84)|0)(3|5|7|8|9)([0-9]{8})$/;

// Valid example: 012-345-6789
export const MASK_PHONE_REGEX = /^(\d{3})-(\d{3})-(\d{4})$/;

export const NAME_REGEX =
  /^(?=.*[^\s\d!@#$%~])[^\d!@#$%~]+(?:\s[^\d!@#$%~]+)*$/;

// Date format: YYYY-MM-DD HH:MM:SS. Example: "2000-12-25 07:00:00"
export const DATE_REGEX =
  /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

export const PID_REGEX = /^[0-9]{3}[0-3][0-9]{2}[0-9]{6}$/;
