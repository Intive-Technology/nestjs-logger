import { Injectable } from '@nestjs/common';
import {  PinoLogger } from 'nestjs-pino';

@Injectable()
export class AppService {
  constructor(private readonly logger: PinoLogger){
    this.logger.setContext(AppService.name);
  }

  getHello(): string {
    this.logger.error('AppService.getHello...............................................');
    return 'Hello World!';
  }
}
