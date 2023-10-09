export class RecordNotFoundError extends Error {
  public readonly name = 'RecordNotFoundError';

  constructor(message: string) {
    super(message);
    // This line is needed for the instance of check to work when target is set to ES5.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DuplicationError extends Error {
  public readonly name = 'DuplicationError';
  public readonly duplicatedField: string;

  constructor(message: string, duplicatedField: string) {
    super(message);
    this.duplicatedField = duplicatedField;

    // This line is needed for the instance of check to work when target is set to ES5.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
