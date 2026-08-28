import { Gender } from 'apps/user-service/src/domain/enums/gender.enum';

export interface IUpdateUserInformationRequest {
  firstName: string;
  lastName: string;
  gender: Gender;
}
