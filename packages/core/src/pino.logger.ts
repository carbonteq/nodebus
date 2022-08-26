import { ILogger } from './base';
import pino, { Logger as PinoBaseLogger } from 'pino';

const createPinoLogger = (
  context: string,
  logLevel: string,
): PinoBaseLogger => {
  const logger = pino({
    level: logLevel,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        levelFirst: true,
        translateTime: 'yyyy-dd-mm, h:MM:ss TT',
        singleLine: true,
      },
    },
    // name: context,
  });

  logger.setBindings({ context });

  return logger;
};

export class PinoLogger implements ILogger {
  private logger: PinoBaseLogger;
  private context: string;

  // todo: update opts to include log level
  constructor(context?: string) {
    // todo: check the LOG_LEVEL against available levels
    const logLevel = process.env.LOG_LEVEL || 'info';
    const ctx = context ?? 'default';

    this.logger = createPinoLogger(ctx, logLevel);
    this.context = ctx;
  }

  setContext(ctx: string): void {
    this.context = ctx;
    this.logger.setBindings({ context: this.context });
  }

  // will be updated later
  setLevel(level: 'info' | 'debug') {
    this.logger = createPinoLogger(this.context, level);
  }

  debug(...data: any[]): void {
    this.logger.debug(data);
  }

  info(...data: any[]): void {
    this.logger.info(data);
  }

  warn(...data: any[]): void {
    this.logger.warn(data);
  }

  error(...data: any[]): void {
    this.logger.error(data);
  }

  fatal(...data: any[]): void {
    this.logger.fatal(data);
  }
}
