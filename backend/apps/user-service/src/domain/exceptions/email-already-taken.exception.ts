export class EmailAlreadyTakenException extends Error {
  public constructor(email: string) {
    super(`Email already in use: ${email}`);
    this.name = 'EmailAlreadyTakenException';
  }
}
