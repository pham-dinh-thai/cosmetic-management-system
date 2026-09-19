import { IsNotEmpty, IsString } from 'class-validator';

export class UnassignManagerRequest {
  @IsString()
  @IsNotEmpty()
  employeeId!: string;
}