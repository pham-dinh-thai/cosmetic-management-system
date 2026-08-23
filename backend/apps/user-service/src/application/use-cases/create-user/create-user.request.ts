import { Gender } from '../../../domain/enums/gender.enum';

export interface ICreateUserRequest {
  firstName: string;
  lastName: string;
  gender: Gender;
  phone: string;
  email: string;
  roleId: string;
}
