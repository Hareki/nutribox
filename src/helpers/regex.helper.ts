// Valid prefix: +84,03, 05, 07, 08, 09
// Main part: exact 8 numbers
export const phoneRegex = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/;

// Valid example: 012-345-6789
export const maskPhoneRegex = /^(\d{3})-(\d{3})-(\d{4})$/;

export const nameRegex = /^(?=.*[^\s\d!@#$%~])[^\d!@#$%~]+(?:\s[^\d!@#$%~]+)*$/;