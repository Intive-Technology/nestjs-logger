import { Transform, TransformCallback } from 'stream';
import { LoggerConfig } from './LoggerConfig';
import { LogType } from './LogType';

interface PostgresParams extends LoggerConfig {
    type: LogType.PG;
    parameters: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
        logTableName?: string;
        logColumnName?: string;
    };
    streamClass: typeof Postgres;
};

declare class Postgres extends Transform {
    private pool;
    private tableName;
    private columnName;
    constructor(params: PostgresParams['parameters'], tableName: string, columnName: string);
    _flush(callback: TransformCallback): void;
    _transform(chunk: any, encoding: string, callback: TransformCallback): void;
}

export { PostgresParams, Postgres };