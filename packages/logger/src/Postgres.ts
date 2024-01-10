import { Transform } from 'stream';
import LoggerConfig from './LoggerConfig';

interface PostgresParams extends LoggerConfig {
    type: 'pg';
    parameters: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
        logTableName?: string;
        logColumnName?: string;
    };
    streamClass: typeof _Postgres;
};

class _Postgres extends Transform {
    /**
     * Create a new instance of the Postgres transform stream.
     * @param params 
     * @param tableName 
     * @param columnName 
     */
    constructor(params: PostgresParams['parameters'], tableName: string, columnName: string) {
        super();
    }
}

export { PostgresParams, _Postgres };