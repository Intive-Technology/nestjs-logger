import { Level } from 'pino';

export default interface LoggerConfig {
    level?: Level;
    type: 'pg' | 'kafka' | 'file' | 'std' | 'stream';
}
