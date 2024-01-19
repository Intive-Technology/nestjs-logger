import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Logger } from '@nestjs/common';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    this.logger.debug('getHello API');
    return this.appService.getHello();
  }

  @Get('/error')
  getError(): string {
    this.logger.debug('getHello API');
    this.logger.error('error', 'AppController');
    throw new Error('error');
  }
}
