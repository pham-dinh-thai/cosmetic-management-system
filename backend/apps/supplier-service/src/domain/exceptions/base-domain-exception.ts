export abstract class BaseDomainException extends Error {
  public abstract readonly statusCode: number;

  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
