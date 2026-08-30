import { Gender } from 'apps/user-service/src/domain/enums/gender.enum';

export class FindUserByIdReadModel {
  public constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly gender: Gender,
    public readonly email: string,
    public readonly roleId: string,
  ) {}
}
