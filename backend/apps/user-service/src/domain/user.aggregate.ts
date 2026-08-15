export type CreateUserProps = {
  id: string;
  email: string;
  name: string;
  password: string;
};

export class User {
  public constructor(
    private readonly id: string,
    private email: string,
    private name: string,
    private password: string,
  ) {}

  public static create(props: CreateUserProps): User {
    return new User(props.id, props.email, props.name, props.password);
  }

  public getId(): string {
    return this.id;
  }

  public getEmail(): string {
    return this.email;
  }

  public getName(): string {
    return this.name;
  }

  public getPassword(): string {
    return this.password;
  }
}
