import { Gender } from './enums/gender.enum';
import { CreateUserProps } from './types';

export class User {
  public constructor(
    private readonly id: string,
    private firstName: string,
    private lastName: string,
    private gender: Gender,
    private email: string,
    private roleId: string,
  ) {}

  public static create(props: CreateUserProps): User {
    return new User(
      props.id,
      props.firstName,
      props.lastName,
      props.gender,
      props.email,
      props.roleId,
    );
  }

  public getId(): string {
    return this.id;
  }

  public getFirstName(): string {
    return this.firstName;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public getGender(): Gender {
    return this.gender;
  }

  public getEmail(): string {
    return this.email;
  }

  public getRoleId(): string {
    return this.roleId;
  }
}
