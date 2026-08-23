import { Gender } from './enums/gender.enum';

export type CreateUserProps = {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  phone: string;
  email: string;
  roleId: string;
};
