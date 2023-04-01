export function isValidPassword(password: string) {
  const minLength = 10;
  const specialCharRegex = /[^a-zA-Z0-9]/;
  const numberRegex = /[0-9]/;

  if (!password) {
    return false;
  }

  if (password.length < minLength) {
    return false;
  }

  if (!specialCharRegex.test(password)) {
    return false;
  }

  if (!numberRegex.test(password)) {
    return false;
  }

  return true;
}
