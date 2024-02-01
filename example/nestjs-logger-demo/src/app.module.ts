import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule, LogType } from '@intive-technology/logger';

import { Transform, TransformCallback, TransformOptions } from 'stream';
import Postgres from '@intive-technology/logger-pg';
import Kafka from '@intive-technology/logger-kafka';

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
  imports: [ 
    LoggerModule.register({
    name: 'nestjs-logger-demo',
  },
  [
    {
      type: LogType.STD,
      level: 'debug'
    },
    {
      type: LogType.FILE,
      parameters: {
       dest: './logs/file.log',
       mkdir: true
      },
    },
    {
      type: LogType.STREAM,
      stream: new TestStream({ prefix: 'test.........'}),
      level: 'error',
      parameters: {}
    },
    {
      type: LogType.STREAM,
      stream: new Postgres({
        database: 'postgres',
        host: 'database',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
      }, 'logs', 'log'),
      parameters: {},
      level: 'debug'
    },
    {
      type: LogType.STREAM,
      parameters: {},
      stream: new Kafka(['localhost:9092'],'test-client','test-topic'),
      level: 'debug'
    }
  ]) ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
