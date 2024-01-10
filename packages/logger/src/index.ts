import { DynamicModule, Module } from "@nestjs/common";
import { LoggerService } from "./logger.service";
import { LoggerModule } from "nestjs-pino";
import { StreamEntry, destination, multistream, MultiStreamOptions } from 'pino';
import { Options } from 'pino-http';
import LoggerConfig from "./LoggerConfig";
import { PostgresParams } from "./Postgres";
import { KafkaConfig } from "./Kafka";


interface FileParams extends LoggerConfig {
    type: 'file';
    parameters: {
        path: string;
    }
};

interface StdParams extends LoggerConfig {
    type: 'std',
};

type LoggerStreamConfig =  PostgresParams | KafkaConfig | FileParams | StdParams;

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
                            stream: destination({
                                dest: stream.parameters.path,
                                sync: true,
                            })
                        });
                        break;
                    case 'std':
                        this.multiStreamArray.push({
                            level: stream.level ?? 'info',
                            stream: process.stdout,
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
