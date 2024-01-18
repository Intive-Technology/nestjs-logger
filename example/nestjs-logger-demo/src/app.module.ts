import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PinoLoggerModule } from '@intive-technology/logger';

@Module({
  imports: [ PinoLoggerModule.register({
    name: 'nestjs-logger-demo',
  },
  [
    {
      type: 'std'
    },
    {
      type: 'file',
      parameters: {
        path: './logs/nestjs-logger-demo.log',

      }
    },
  ]) ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}