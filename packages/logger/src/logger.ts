import { DynamicModule, Module } from "@nestjs/common";
import { LoggerService } from "./logger.service";
import { LoggerModule as PinoLoggerModule } from "nestjs-pino";
import { StreamEntry, destination, multistream, MultiStreamOptions } from 'pino';
import { SonicBoomOpts } from 'sonic-boom';
import { Options } from 'pino-http';
import { LoggerConfig } from "./LoggerConfig";
import { Transform } from "stream";
import { LogType } from "./LogType";


interface FileParams extends LoggerConfig {
    type: LogType.FILE;
    parameters: SonicBoomOpts
};

interface StdParams extends LoggerConfig {
    type: LogType.STD;
};

interface StreamParams extends LoggerConfig {
    type: LogType.STREAM
    parameters: Record<string, string | number | null>,
    stream: Transform
}

type LoggerStreamConfig = FileParams | StdParams | StreamParams;

@Module({
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule {
    static multiStreamArray: StreamEntry[] = [];
    static register(options: Options, streams: LoggerStreamConfig[] = [], streamOptions: MultiStreamOptions = {}): DynamicModule {

        if (streams.length > 0) {
            streams.forEach(streamParam => {
                switch (streamParam.type) {
                    case LogType.FILE:
                        this.multiStreamArray.push({
                            level: streamParam.level ?? 'info',
                            stream: destination(streamParam.parameters),
                        });
                        break;
                    case LogType.STD:
                        this.multiStreamArray.push({
                            level: streamParam.level ?? 'info',
                            stream: process.stdout,
                        });
                        break;
                    case LogType.STREAM:
                        this.multiStreamArray.push({
                            level: streamParam.level ?? 'info',
                            stream: streamParam.stream,
                        });
                        break;
                }
            });
        }

        const imports = [
            PinoLoggerModule.forRoot({
                pinoHttp: [
                    options,
                    multistream(this.multiStreamArray, streamOptions)
                ]
            })
        ];
        return {
            imports,
            module: LoggerModule,
        };
    }
}
