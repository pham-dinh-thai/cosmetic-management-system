import { Gender } from './enums/gender.enum';

export type CreateUserProps = {
  firstName: string;
  lastName: string;
  gender: Gender;
  email: string;
  roleId: string;
};

export type FromPersistentUserProps = {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  email: string;
  roleId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateUserInformationProps = {
  firstName: string;
  lastName: string;
  gender: Gender;
};
