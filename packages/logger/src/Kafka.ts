import { Transform } from "stream";
import LoggerConfig from "./LoggerConfig";

interface KafkaConfig extends LoggerConfig {
    streamClass: typeof _Kafka;
    type: 'kafka';
    parameters: {
        brokers: string[];
        clientId: string;
        topic: string;
    }
}

/**
 * A transform stream for writing logs to Kafka.
 */
class _Kafka extends Transform {
    /**
     * Create a new instance of the Kafka transform stream.
     * @param {string[]} broker - The Kafka broker.
     * @param {string} clientId - The client id.
     * @param {string} topic - The topic.
     */
    constructor(broker: string[], clientId: string, topic: string) {
        super();
    }
}

export { KafkaConfig, _Kafka };