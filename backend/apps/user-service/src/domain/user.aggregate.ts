import { Gender } from './enums/gender.enum';
import {
  CreateUserProps,
  FromPersistentUserProps,
  UpdateUserInformationProps,
} from './types';

export class User {
  public constructor(
    private readonly id: string,
    private firstName: string,
    private lastName: string,
    private gender: Gender,
    private email: string,
    private roleId: string,
    private createdAt?: Date,
    private updatedAt?: Date,
  ) {}

  public static create(props: CreateUserProps): User {
    return new User(
      undefined as unknown as string,
      props.firstName,
      props.lastName,
      props.gender,
      props.email,
      props.roleId,
    );
  }

  public static fromPersistent(props: FromPersistentUserProps): User {
    return new User(
      props.id,
      props.firstName,
      props.lastName,
      props.gender,
      props.email,
      props.roleId,
      props.createdAt,
      props.updatedAt,
    );
  }

  public updateInformation(props: UpdateUserInformationProps): void {
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.gender = props.gender;
    this.updatedAt = new Date();
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

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }
}
