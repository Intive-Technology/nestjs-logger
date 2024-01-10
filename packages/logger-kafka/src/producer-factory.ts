import { Kafka, Message, Producer, ProducerBatch, TopicMessages, KafkaConfig, ProducerConfig } from 'kafkajs';

/**
 * Class representing a Kafka producer.
 */
class ProducerFactory {
    private producer: Producer

    /**
     * Create a Kafka producer.
     * @param {string} clientId - The ID of the client. Default is 'logger'.
     * @param {string[]} brokers - The brokers to connect to. Default is ['kafka:9092'].
     * @param {KafkaConfig | null} kafkaConfig - The configuration for the Kafka client. If null, default configuration is used.
     * @param {ProducerConfig | null} producerConfig - The configuration for the Kafka producer. If null, default configuration is used.
     */
    constructor(clientId: string, brokers: string[], kafkaConfig: KafkaConfig | null, producerConfig: ProducerConfig | null) {
        kafkaConfig = {
            ...kafkaConfig,
            clientId,
            brokers
        }
        this.producer = this.createProducer(kafkaConfig, producerConfig);
    }

    /**
     * Start the producer.
     * @return {Promise<void>} The promise that resolves when the producer is started.
     */
    public async start(): Promise<void> {
        try {
            await this.producer.connect()
        } catch (error) {
            console.log('Error connecting the producer: ', error)
        }
    }

    /**
     * Shutdown the producer.
     * @return {Promise<void>} The promise that resolves when the producer is shutdown.
     */
    public async shutdown(): Promise<void> {
        await this.producer.disconnect()
        console.log('Producer disconnected');
    }

    /**
     * Send a batch of messages.
     * @param {'logs'} topic - The topic to send the messages to.
     * @param {Array<Record>} messages - The messages to send.
     * @return {Promise<void>} The promise that resolves when the messages are sent.
     */
    public async sendBatch(topic: string, messages: Array<Record<string, any>>): Promise<void> {
        const kafkaMessages: Array<Message> = messages.map((message) => {
            return {
                value: JSON.stringify(message)
            }
        })

        const topicMessages: TopicMessages = {
            topic,
            messages: kafkaMessages
        }

        const batch: ProducerBatch = {
            topicMessages: [topicMessages]
        }

        await this.producer.sendBatch(batch)
    }

    /**
     * Send a batch of messages.
     * @param {'logs'} topic - The topic to send the messages to.
     * @param {Array<Record<string, any>} messages - The messages to send.
     * @return {Promise<void>} The promise that resolves when the messages are sent.
     */
    public async send(topic: string, messages: Array<Record<string, any>>): Promise<void> {
        const kafkaMessages: Array<Message> = messages.map((message) => {
            return {
                value: JSON.stringify(message)
            }
        })

        this.producer.send({
            topic,
            messages: kafkaMessages
        }).then().catch();
    }

    /**
     * Creates a Kafka producer.
     * @param {KafkaConfig} kafkaConfig - The configuration for the Kafka client.
     * @param {ProducerConfig | null} producerConfig - The configuration for the Kafka producer. If null, default configuration is used.
     * @return {Producer} The created Kafka producer.
     */
    private createProducer(kafkaConfig: KafkaConfig, producerConfig: ProducerConfig | null): Producer {
        const kafka = new Kafka(kafkaConfig);
        return kafka.producer(producerConfig!);
    }
}

export { ProducerFactory };