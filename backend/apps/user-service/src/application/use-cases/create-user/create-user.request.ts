import { Gender } from '../../../domain/enums/gender.enum';

export interface ICreateUserRequest {
  firstName: string;
  lastName: string;
  gender: Gender;
  email: string;
  password: string;
  roleId: string;
}
