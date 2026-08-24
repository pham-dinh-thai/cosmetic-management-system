import { Injectable } from '@nestjs/common';

@Injectable()
export class DepartmentServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
