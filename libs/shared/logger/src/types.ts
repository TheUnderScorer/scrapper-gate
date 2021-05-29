export type LoggerFn = (...args: unknown[]) => unknown;

export interface Logger {
  info: LoggerFn;
  warn: LoggerFn;
  error: LoggerFn;
  fatal: LoggerFn;
  debug: LoggerFn;
}
