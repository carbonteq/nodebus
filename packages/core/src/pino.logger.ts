import { ALLOWED_LEVELS, Logger, LogLevel, LOG_LEVEL } from './base/logger';
import pino, { Logger as PinoBaseLogger } from 'pino';

const createPinoLogger = (
	context: string,
	logLevel: LogLevel,
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

export class PinoLogger implements Logger {
	private logger: PinoBaseLogger;
	private context: string;

	static readonly DEFAULT_LOG_LEVEL: LogLevel = LOG_LEVEL.INFO;

	// todo: update opts to include log level
	constructor(context?: string) {
		const logLevelCand = process.env.LOG_LEVEL || '';
		let logLevel: LogLevel;

		if (ALLOWED_LEVELS.has(logLevelCand)) {
			logLevel = logLevelCand as LogLevel;
		} else {
			logLevel = PinoLogger.DEFAULT_LOG_LEVEL;
		}

		const ctx = context ?? 'default';

		this.logger = createPinoLogger(ctx, logLevel);
		this.context = ctx;
	}

	setContext(ctx: string): void {
		this.context = ctx;
		this.logger.setBindings({ context: this.context });
	}

	// will be updated later
	setLevel(level: LogLevel): void {
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

	log(level: LogLevel, ...args: any[]): void {
		switch (level) {
			case LOG_LEVEL.ERROR:
				this.info(...args);
				break;
			case LOG_LEVEL.WARN:
				this.warn(...args);
				break;
			case LOG_LEVEL.INFO:
				this.info(...args);
				break;
			case LOG_LEVEL.DEBUG:
				this.debug(...args);
			// break;
		}
	}
}
