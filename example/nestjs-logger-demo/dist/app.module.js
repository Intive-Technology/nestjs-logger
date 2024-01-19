"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const logger_1 = require("@intive-technology/logger");
const stream_1 = require("stream");
class TestStream extends stream_1.Transform {
    constructor(opts) {
        super();
        this.prefix = opts.prefix;
    }
    _transform(chunk, encoding, callback) {
        console.log(this.prefix, chunk.toString());
        callback(null, chunk);
    }
}
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [logger_1.LoggerModule.register({
                name: 'nestjs-logger-demo',
            }, [
                {
                    type: logger_1.LogType.STD
                },
                {
                    type: logger_1.LogType.FILE,
                    parameters: {
                        dest: './logs/file.log',
                        mkdir: true
                    },
                },
                {
                    type: logger_1.LogType.STREAM,
                    streamClass: TestStream,
                    level: 'error',
                    parameters: {
                        prefix: 'test.............'
                    }
                }
            ])],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map