import { Kafka, Producer } from 'kafkajs';
import { Server } from 'socket.io';
import Subject from '../mongoDB/subject';
import MessageMain from '../mongoDB/mainMessages';
import MessageThread from '../mongoDB/threadMessage';

// class KafkaService {
//     private kafka: Kafka;
//     private producer: Producer;

//     constructor() {
//         this.kafka = new Kafka({brokers: ['localhost:9092'] });
//         const admin = this.kafka.admin();
//         admin.createTopics({topics: [{ topic: 'subjects'}, { topic: 'messagesMain'}, { topic: 'messagesThread'}]});
//         admin.disconnect();
//         this.producer = this.kafka.producer();
//         this.producer.connect();
//     }

//     public async sendMessage(topic: string, message: string) {
//         await this.producer.send({
//             topic,
//             messages: [{ value: message }],
//         });
//     }
// }

const kafka = new Kafka({
    brokers: ['localhost:9092'],
});

const initKafka= async () => {
    const admin = kafka.admin();
    await admin.connect();
    await admin.createTopics({
        topics: [{ topic: 'subjects' }, { topic: 'messagesMain' }, { topic: 'messagesThread' }],
    });
    await admin.disconnect();
}

initKafka();
let producer: Producer | null = null;
let server: Server | null = null;

export const functionToGetIo = (io: Server) => {
    console.log("kafka: io inside functionToGetIo------>", io);
    server = io;
}

export async function createProducer() {
    if (producer) return producer;
    const _producer = kafka.producer();
    await _producer.connect();
    producer = _producer;
    return producer;
}

export async function sendMessage(topic: string, message: any) {
    const producer = await createProducer();
    console.log("kafka: inside sendMessage---->")
    await producer.send({ 
        topic: topic, 
        messages: [{ key: Date.now().toString(), value: JSON.stringify(message) }] 
    });
    console.log("kafka: sendMessage: messages send to topic ");
    return true;
}

export async function startMessageConsumer() {
    const consumer = kafka.consumer({ groupId: 'default' });
    await consumer.connect();
    await consumer.subscribe({ topics: ['subjects', 'messagesMain', 'messagesThread'], fromBeginning: true });
    return consumer.run({
        autoCommit: true,
        eachMessage: async ({ message }) => {
            console.log("kafka: message inside consumer------>", message);
            if (!message.value) return;
            const deserializedMessage = JSON.parse(message.value.toString());

            console.log("kafka: before emitting to sockets");
            if(server) {
                server.emit('event:message', deserializedMessage);
                console.log("kafka: deserializedMessage emitted to socket");
            }
            console.log("kafka: after emitting to sockets");

            console.log("kafka: deserializedMessage------>", deserializedMessage);
            console.log("kafka: deserializedMessage.topic------>", deserializedMessage.topic);
            try {
                if ("threadId" in deserializedMessage && "messageId" in deserializedMessage && "subjectId" in deserializedMessage) {
                    console.log("kafka: messageThread from kafka");
                    const newMessageThread = new MessageThread(deserializedMessage);
                    await newMessageThread.save();
                } else if ("messageId" in deserializedMessage && "subjectId" in deserializedMessage) {
                    console.log("kafka: messageMain from kafka");
                    const newMessageMain = new MessageMain(deserializedMessage);
                    await newMessageMain.save();
                } else if ("subjectId" in deserializedMessage) {
                    console.log("kafka: subject from kafka");
                    const newSubject = new Subject(deserializedMessage);
                    await newSubject.save();
                }
            } catch (error) {
                console.error("Error adding message to database", error);
                consumer.pause([{ topic: 'subjects' }, { topic: 'messagesMain' }, { topic: 'messagesThread' }]);
                setTimeout(() => {
                    consumer.resume([{ topic: 'subjects' }, { topic: 'messagesMain' }, { topic: 'messagesThread' }]);
                    console.log("kafka: Consumer resumed");
                }, 5000);
            }
        },
    });
}