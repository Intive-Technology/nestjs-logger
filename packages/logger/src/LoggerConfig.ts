import { Level } from 'pino';
import { LogType } from './LogType';

export interface LoggerConfig {
    level?: Level;
    type: LogType;
}
