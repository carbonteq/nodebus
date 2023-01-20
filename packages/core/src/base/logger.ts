import { LogLevel } from '@carbonteq/hexapp';

export const ALLOWED_LEVELS = new Set(Object.values(LogLevel) as string[]);

export { Logger, LogLevel } from '@carbonteq/hexapp';
