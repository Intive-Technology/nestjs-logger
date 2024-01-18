import { DynamicModule, Module } from "@nestjs/common";
import { LoggerService } from "./logger.service";
import { LoggerModule as PinoLoggerModule } from "nestjs-pino";
import { StreamEntry, destination, multistream, MultiStreamOptions } from 'pino';
import { SonicBoomOpts } from 'sonic-boom';
import { Options } from 'pino-http';
import { LoggerConfig } from "./LoggerConfig";
import { PostgresParams } from "./Postgres";
import { KafkaConfig } from "./Kafka";
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
    streamClass: typeof Transform
}

type LoggerStreamConfig = PostgresParams | KafkaConfig | FileParams | StdParams | StreamParams;

@Module({
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule {
    static multiStreamArray: StreamEntry[] = [];
    static register(options: Options, streams: LoggerStreamConfig[] = [], streamOptions: MultiStreamOptions = {}): DynamicModule {

        if (streams.length > 0) {
            streams.forEach(stream => {
                switch (stream.type) {
                    case LogType.PG:
                        this.multiStreamArray.push({
                            level: stream.level ?? 'info',
                            stream: new stream.streamClass(stream.parameters, stream.parameters.logTableName ?? 'logs', stream.parameters.logColumnName ?? 'log')
                        });
                        break;
                    case LogType.KAFKA:
                        this.multiStreamArray.push({
                            level: stream.level ?? 'info',
                            stream: new stream.streamClass(stream.parameters.brokers, stream.parameters.clientId, stream.parameters.topic)
                        });
                        break;
                    case LogType.FILE:
                        this.multiStreamArray.push({
                            level: stream.level ?? 'info',
                            stream: destination(stream.parameters),
                        });
                        break;
                    case LogType.STD:
                        this.multiStreamArray.push({
                            level: stream.level ?? 'info',
                            stream: process.stdout,
                        });
                        break;
                    case LogType.STREAM:
                        this.multiStreamArray.push({
                            level: stream.level ?? 'info',
                            stream: new stream.streamClass(stream.parameters),
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
