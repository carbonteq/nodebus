// A trick to avoid duplicating values, and guaranteeing type and runtime safety
const allowedLevels = ['info', 'debug', 'warn'] as const;
/* export const ALLOWED_LEVELS = new Set(allowedLevels); */
export const ALLOWED_LEVELS = new Set((allowedLevels as unknown) as string[]);

export type LogLevel = typeof allowedLevels[number];

export interface ILogger {
  debug(...data: any[]): void;
  // trace(...data: any[]): void;
  info(...data: any[]): void;
  warn(...data: any[]): void;
  error(...data: any[]): void;
  fatal(...data: any[]): void;
  setContext(ctx: string): void;
  setLevel(level: LogLevel): void;
}
