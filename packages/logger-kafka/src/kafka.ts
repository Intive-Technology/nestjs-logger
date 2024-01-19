import { ProducerFactory } from './producer-factory';
import { TransformCallback, Transform } from 'stream';

/**
 * A transform stream for writing logs to Kafka.
 */
export default class Kafka extends Transform {
    private producer: ProducerFactory;
    topic: string;

    /**
     * Create a new instance of the Kafka transform stream.
     * @param {string[]} brokers - The Kafka broker.
     * @param {string} clientId - The client id.
     * @param {string} topic - The topic.
     * @constructor
     * @since 2024-01-10
     * @author @harshad-intive
     */
    constructor(brokers: string[], clientId: string, topic: string) {
        super();
        this.topic = topic;;
        try {
            console.log('Connecting the producer...', brokers);
            this.producer = new ProducerFactory(clientId, brokers, null, {});
            this.producer.start();
        } catch (error) {
            console.log('Error connecting the producer: ', error);
        }
    }

    /**
     * Flush the transform stream.
     * @param callback - The callback function.
     */
    _flush(callback: TransformCallback): void {
        this.producer.shutdown();
        callback(null, null);
    }

    /**
     * Transform the chunk of data.
     * @param chunk - The chunk of data.
     * @param encoding - The encoding type.
     * @param callback - The callback function.
     * @return {void}
     */
    _transform(chunk: any, encoding: string, callback: TransformCallback) {
        const content = chunk.toString('utf-8')
        let log: any
        try {
            log = JSON.parse(content)
        } catch {
            // pass it through non-json.
            return callback(null, `${chunk}\n`)
        }

        this.producer.sendBatch(this.topic, [log])
            .then(
                () => callback(null, `${chunk}\n`),
                err => callback(err, null)
            )
    }
}
