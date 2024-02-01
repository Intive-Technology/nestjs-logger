# Logging Framework for NestJS

## Description

This is a custom logging framework for NestJS applications. It provides a flexible and extensible way to handle logging within your NestJS project.

## Features

- Customizable log levels (info, warn, error, etc.)
- Support for multiple log transports (console, file, database, etc.)
- Built-in log formatting options (timestamp, log level, etc.)
- Ability to create custom loggers and log handlers
- Integration with NestJS logging system

## Installation

Install the package using npm:

```bash
npm install @intive-technology/logging
```

example

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Logger } from '@intive-technology/logger';

@Module({
  imports: [ Logger.register({
    name: 'nestjs-logger-demo',
  },
  [
    {
      type: 'std',
      level: 'debug'
    },
    {
      type: 'file',
      parameters: {
        path: './logs/example.log',
        level: 'error'
      }
    },
  ]) ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

## Log Level

Pino logs messages with a level of info or higher.

1. **fatal**: The highest log level, indicating a critical error that may lead to application termination.
2. **error**: Indicates an error that occurred but did not cause the application to terminate.
3. **warn**: Indicates a warning or a non-critical issue that may require attention.
4. **info**: Provides general information about the application's state or events.
5. **debug**: For debugging purposes, provides detailed information about the application's internal operations.
6. **trace**: The lowest log level, used for very detailed or fine-grained logs.

## Log Destinations

We are using pino logger multisteam function to stream logs to multiple destination.

### 1. **std** Console log 

Uses `process.stdout` stream for logging to the console.

```js
{
      type: 'std'
}
```

### 2. **File** File stream log

Need to add path parameter to write logs.

```javascript
{
      type: 'file',
      parameters: {
        path: './logs/example.log',
        level: 'error'
      }
}
```

### **logger-pg** PostgreSQL logger

Install postgresql plugin


```bash
npm install @intive-technology/logging-pg
```

Use below configuration to add streaming logs in PostgreSQL

```js

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

```

### **logger-kafka** Kafka logger

Install postgresql plugin


```bash
npm install @intive-technology/logging-kafka
```

Use below configuration to add streaming logs in Kafka.

```js

{
      type: LogType.STREAM,
      parameters: {},
      stream: new Kafka(['localhost:9092'],'test-client','test-topic'),
      level: 'debug'
}

```



### **Custom Stream** Create custom stream

Use below configuration to add streaming logs in Kafka.

```js

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
      type: LogType.STREAM,
      stream: new TestStream({ prefix: 'auth-app: '}),
      level: 'error',
      parameters: {}
    }
  ]) ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```