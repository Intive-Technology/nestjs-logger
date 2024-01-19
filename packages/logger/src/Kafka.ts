import { Transform, TransformCallback } from "stream";
import { LoggerConfig } from "./LoggerConfig";
import { LogType } from "./LogType";

interface KafkaConfig extends LoggerConfig {
    streamClass: typeof Kafka;
    type: LogType.KAFKA;
    parameters: {
        brokers: string[];
        clientId: string;
        topic: string;
    }
}

/**
 * A transform stream for writing logs to Kafka.
 */
declare class Kafka extends Transform {
    producer: any;
    topic: string;
    constructor(brokers: string[], clientId: string, topic: string);
    _flush(callback: TransformCallback): void;
    _transform(chunk: any, encoding: string, callback: TransformCallback): void;
}


export { KafkaConfig, Kafka };