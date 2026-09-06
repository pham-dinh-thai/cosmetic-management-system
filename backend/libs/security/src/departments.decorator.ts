import { SetMetadata } from '@nestjs/common';

export const DEPARTMENTS_KEY = 'departments';

export const Departments = (...codes: string[]) =>
  SetMetadata(DEPARTMENTS_KEY, codes);
