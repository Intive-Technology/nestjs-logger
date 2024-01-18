import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from '@intive-technology/logger';
// import { KafkaConfig } from '@intive-technology/logger-kafka';

@Module({
  imports: [ LoggerModule.register({
    name: 'nestjs-logger-demo',
  },
  [
    {
      type: 'std'
    },
    {
      type: 'file',
      parameters: {
       dest: './logs/file.log',
      },
    },
  ]) ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
