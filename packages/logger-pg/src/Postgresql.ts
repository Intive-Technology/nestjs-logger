import * as Pg from "pg";
import { Transform, TransformCallback } from "stream";

/**
 * A transform stream for writing logs to Postgres.
 */
class Postgres extends Transform {
    private pool: Pg.Pool;
    private tableName: string;
    private columnName: string;

    /**
     * Create a new instance of the Postgres transform stream.
     * @param {Pg.PoolConfig} params - The connection parameters.
     * @param {string} tableName - The table name.
     * @param {string} columnName - The column name.
     * @constructor
     * @since 2024-01-10 
     * @author @harshad-intive
     */
    constructor(params: Pg.PoolConfig, tableName: string, columnName: string) {
        super();
        this.tableName = tableName;
        this.columnName = columnName;
        this.pool = new Pg.Pool(params);
    }

    
  /**
   * Flush the transform stream.
   * @param {TransformCallback} callback - The callback function.
   */
  _flush(callback: TransformCallback): void {
    this.pool.end()
    callback(null, null)
  }

  /**
   * Transform the chunk of data.
   * @param {any} chunk - The chunk of data.
   * @param {string} encoding - The encoding type.
   * @param {TransformCallback} callback - The callback function.
   */
  _transform(chunk: any, encoding: string, callback: TransformCallback) {
    console.log('chunk............')
    const content = chunk.toString('utf-8')
    let log: any
    try {
      log = JSON.parse(content)
    } catch {
      // pass it through non-json.
      return callback(null, `${chunk}\n`)
    }

    this.pool.query(`INSERT INTO ${this.tableName}(${this.columnName}) VALUES($1)`, [log])
      .then(
        () => callback(null, `${chunk}\n`),
        err => callback(err, null)
      ).catch(err => {console.log(err)})
  }
}

export default Postgres;