// Valid prefix: +84,03, 05, 07, 08, 09
// Main part: exact 8 numbers
export const PHONE_REGEX = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/;

// Valid example: 012-345-6789
export const MASK_PHONE_REGEX = /^(\d{3})-(\d{3})-(\d{4})$/;

export const NAME_REGEX =
  /^(?=.*[^\s\d!@#$%~])[^\d!@#$%~]+(?:\s[^\d!@#$%~]+)*$/;
