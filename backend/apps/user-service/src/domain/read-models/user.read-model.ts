import { Gender } from '../enums/gender.enum';

export class UserReadModel {
  public constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly gender: Gender,
    public readonly phone: string,
    public readonly email: string,
    public readonly roleId: string,
  ) {}
}
