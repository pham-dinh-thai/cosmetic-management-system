export interface IEmployeeLoggerPort {
  warn(message: string, ...context: unknown[]): void;

  error(message: string, ...context: unknown[]): void;

  log(message: string, ...context: unknown[]): void;
}

export const EMPLOYEE_LOGGER_PORT = 'IEmployeeLoggerPort';
