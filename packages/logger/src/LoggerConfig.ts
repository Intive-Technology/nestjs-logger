import { Level } from 'pino';
import { Transform } from 'stream';

export default interface LoggerConfig {
    level?: Level;
    type: 'pg' | 'kafka' | 'file' | 'std';
    // streamClass: typeof Transform;
}
