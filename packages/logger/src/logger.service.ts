import { Inject, Injectable } from '@nestjs/common';
import { PinoLogger, Params, PARAMS_PROVIDER_TOKEN } from 'nestjs-pino';

@Injectable()
class LoggerService extends PinoLogger {
  constructor(
    @Inject(PARAMS_PROVIDER_TOKEN) params: Params
  ) {
    super(params);
  }
}

export { LoggerService };