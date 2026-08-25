export class DepartmentCodeAlreadyExistsException extends Error {
  constructor(code: string) {
    super(`Code already in use: ${code}`);
  }
}
