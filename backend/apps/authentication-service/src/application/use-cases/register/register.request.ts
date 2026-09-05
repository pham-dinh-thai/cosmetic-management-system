export type RegisterGender = 'male' | 'female' | 'other';

export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  gender: RegisterGender;
  email: string;
  password: string;
}
