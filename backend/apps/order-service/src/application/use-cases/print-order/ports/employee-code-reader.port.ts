export interface IEmployeeCodeReaderPort {
  getEmployeeCode(userId: string): Promise<string | null>;
}

export const EMPLOYEE_CODE_READER_PORT = 'IEmployeeCodeReaderPort';