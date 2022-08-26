export interface ILogger {
  debug(...data: any[]): void;
  // trace(...data: any[]): void;
  info(...data: any[]): void;
  warn(...data: any[]): void;
  error(...data: any[]): void;
  fatal(...data: any[]): void;
  setContext(ctx: string): void;
  setLevel(level: 'info' | 'debug'): void;
}
