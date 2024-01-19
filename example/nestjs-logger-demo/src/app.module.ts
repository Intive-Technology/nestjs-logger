import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogType, LoggerModule } from '@intive-technology/logger';
import * as Postgres from '@intive-technology/logger-pg';
import * as Kafka from '@intive-technology/logger-kafka';

import { Transform, TransformCallback, TransformOptions } from 'stream';

class TestStream extends Transform {
  prefix: string;
  constructor(opts: {prefix: string} & TransformOptions) {
    super();
    this.prefix = opts.prefix;
  }

  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
    console.log(this.prefix, chunk.toString());
    callback(null, chunk);
  }
}

@Module({
  imports: [ LoggerModule.register({
    name: 'nestjs-logger-demo',
  },
  [
    {
      type: LogType.STD
    },
    {
      type: LogType.FILE,
      parameters: {
       dest: './logs/file.log',
       mkdir: true
      },
    },
    {
      // custom logger class
      type: LogType.STREAM,
      streamClass: TestStream,
      level: 'error',
      parameters:{
        prefix: 'test.............'
      }
    },
    {
      type: LogType.PG,
      streamClass: Postgres,
      parameters:{
        database: 'postgres',
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        logTableName: 'logs',
        logColumnName: 'log',
      }
    },
    {
      type: LogType.KAFKA,
      streamClass: Kafka,
      parameters: {
        brokers: ['localhost:9092'],
        clientId: 'test-client',
        topic: 'test-topic',
      }
    }
  ]) ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
