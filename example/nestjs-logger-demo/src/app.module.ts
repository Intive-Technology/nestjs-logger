import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule,  } from '@intive-technology/logger';
import { LogType } from '@intive-technology/logger/lib/LogType';

// import { KafkaConfig } from '@intive-technology/logger-kafka';

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
      },
    },
  ]) ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
