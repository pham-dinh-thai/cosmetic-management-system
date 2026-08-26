import { Gender } from './enums/gender.enum';

export type CreateUserProps = {
  firstName: string;
  lastName: string;
  gender: Gender;
  email: string;
  roleId: string;
};
