export class DuplicationError extends Error {
  public readonly name = 'DuplicationError';
  public readonly duplicatedField: string;

  constructor(duplicatedField: string, message: string) {
    super(message);
    this.duplicatedField = duplicatedField;

    // This line is needed for the instance of check to work when target is set to ES5.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends Error {
  public readonly name = 'BadRequestError';
  public readonly badRequestField: string;

  constructor(badRequestField: string, message: string) {
    super(message);
    this.badRequestField = badRequestField;

    // This line is needed for the instance of check to work when target is set to ES5.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
