"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProducer = createProducer;
exports.sendMessage = sendMessage;
exports.startMessageConsumer = startMessageConsumer;
const kafkajs_1 = require("kafkajs");
// import Subject from '../mongoDB/subject';
// import MessageMain from '../mongoDB/mainMessages';
// import MessageThread from '../mongoDB/threadMessage';
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
const kafka = new kafkajs_1.Kafka({
    brokers: ['localhost:9092'],
});
const initKafka = () => __awaiter(void 0, void 0, void 0, function* () {
    const admin = kafka.admin();
    yield admin.connect();
    yield admin.createTopics({
        topics: [{ topic: 'subjects' }, { topic: 'messagesMain' }, { topic: 'messagesThread' }],
    });
    yield admin.disconnect();
});
initKafka();
let producer = null;
let socket = null;
function createProducer() {
    return __awaiter(this, void 0, void 0, function* () {
        if (producer)
            return producer;
        const _producer = kafka.producer();
        yield _producer.connect();
        producer = _producer;
        return producer;
    });
}
function sendMessage(topic, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const producer = yield createProducer();
        yield producer.send({
            topic: topic,
            messages: [{ key: Date.now().toString(), value: JSON.stringify(message) }]
        });
        return true;
    });
}
function startMessageConsumer() {
    return __awaiter(this, void 0, void 0, function* () {
        const consumer = kafka.consumer({ groupId: 'my-group' });
        yield consumer.connect();
        yield consumer.subscribe({ topics: ['subjects', 'messagesMain', 'messagesThread'], fromBeginning: true });
        return consumer.run({
            autoCommit: true,
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ message }) {
                console.log("message inside consumer", message);
                if (!message.value)
                    return;
                const deserializedMessage = JSON.parse(message.value.toString());
                console.log("deserializedMessage", deserializedMessage);
                console.log("deserializedMessage.topic", deserializedMessage.topic);
                // socket.emit('event:message', deserializedMessage.);
                // try {
                //     if (deserializedMessage.topic === 'subjects') {
                //         const newSubject = new Subject(deserializedMessage);
                //         await newSubject.save();
                //     } else if (deserializedMessage.topic === 'messagesMain') {
                //         const newMessageMain = new MessageMain(deserializedMessage);
                //         await newMessageMain.save();
                //     } else if (deserializedMessage.topic === 'messagesThread') {
                //         const newMessageThread = new MessageThread(deserializedMessage);
                //         await newMessageThread.save();
                //     }
                // } catch (error) {
                //     console.error("Error emitting message", error);
                // }
            }),
        });
    });
}
