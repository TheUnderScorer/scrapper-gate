export type LoggerFn = (msg: string, ...args: unknown[]) => unknown;

export interface Logger {
  info: LoggerFn;
  warn: LoggerFn;
  error: LoggerFn;
  fatal: LoggerFn;
  debug: LoggerFn;
}
