export class InvalidCodeException extends Error {
  public constructor(prefix: string, value: string) {
    super(`Invalid code "${value}" for prefix "${prefix}"`);
  }
}
