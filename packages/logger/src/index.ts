import { DynamicModule, Module } from "@nestjs/common";
import { LoggerService } from "./logger.service";
import { LoggerModule } from "nestjs-pino";
import { StreamEntry, destination, multistream, MultiStreamOptions, DestinationStream } from 'pino';
import { Options } from 'pino-http';
import LoggerConfig from "./LoggerConfig";
import { PostgresParams } from "./Postgres";
import { KafkaConfig } from "./Kafka";
import { Transform } from "stream";


interface FileParams extends LoggerConfig {
    type: 'file';
    parameters: DestinationStream
};

interface StdParams extends LoggerConfig {
    type: 'std',
};

interface StreamParams extends LoggerConfig {
    type: 'stream',
    parameters: Record<string, string | number | null>,
    streamClass: typeof Transform
}

type LoggerStreamConfig = PostgresParams | KafkaConfig | FileParams | StdParams | StreamParams;

@Module({
    providers: [LoggerService],
    exports: [LoggerService],
})
export class PinoLoggerModule {
    static multiStreamArray: StreamEntry[] = [];
    static register(options: Options, streams: LoggerStreamConfig[] = [], streamOptions: MultiStreamOptions = {}): DynamicModule {

        if (streams.length > 0) {
            streams.forEach(stream => {
                switch (stream.type) {
                    case 'pg':
                        this.multiStreamArray.push({
                            level: stream.level ?? 'info',
                            stream: new stream.streamClass(stream.parameters, stream.parameters.logTableName ?? 'logs', stream.parameters.logColumnName ?? 'log')
                        });
                        break;
                    case 'kafka':
                        this.multiStreamArray.push({
                            level: stream.level ?? 'info',
                            stream: new stream.streamClass(stream.parameters.brokers, stream.parameters.clientId, stream.parameters.topic)
                        });
                        break;
                    case 'file':
                        this.multiStreamArray.push({
                            level: stream.level ?? 'info',
                            stream: destination(stream.parameters)
                        });
                        break;
                    case 'std':
                        this.multiStreamArray.push({
                            level: stream.level ?? 'info',
                            stream: process.stdout,
                        });
                        break;
                    case 'stream':
                        this.multiStreamArray.push({
                            level: stream.level ?? 'info',
                            stream: new stream.streamClass(stream.parameters),
                        });
                        break;
                }
            });
        }

        const imports = [
            LoggerModule.forRoot({
                pinoHttp: [
                    options,
                    multistream(this.multiStreamArray, streamOptions)
                ]
            })
        ];
        return {
            imports,
            module: PinoLoggerModule,
        };
    }
}
