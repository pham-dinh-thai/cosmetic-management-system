export interface IOrderLoggerPort {
  warn(message: string, ...context: unknown[]): void;

  error(message: string, ...context: unknown[]): void;

  log(message: string, ...context: unknown[]): void;

  createContext(context: string): IOrderLoggerPort;
}

export const ORDER_LOGGER_PORT = 'IOrderLoggerPort';
