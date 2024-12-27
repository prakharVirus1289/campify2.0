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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const kafka_1 = require("../kafka/kafka");
const subject_1 = __importDefault(require("../mongoDB/subject"));
const mainMessages_1 = __importDefault(require("../mongoDB/mainMessages"));
const threadMessage_1 = __importDefault(require("../mongoDB/threadMessage"));
class SocketService {
    constructor() {
        this.io = new socket_io_1.Server({
            cors: {
                origin: 'http://localhost:5173',
                methods: ['GET', 'POST', 'PUT', 'DELETE']
            }
        });
    }
    initListener() {
        const io = this.io;
        io.on('connect', (socket) => {
            console.log('Client connected to socket ', socket.id);
            socket.on('event:subject', (subject) => __awaiter(this, void 0, void 0, function* () {
                const newSubject = new subject_1.default(subject);
                (0, kafka_1.sendMessage)("subject", subject);
                yield newSubject.save();
                io.emit('event:message', newSubject);
                console.log(newSubject);
            }));
            socket.on('event:messageMain', (messageMain) => __awaiter(this, void 0, void 0, function* () {
                const newMessageMain = new mainMessages_1.default(messageMain);
                (0, kafka_1.sendMessage)('messageMain', messageMain);
                yield newMessageMain.save();
                io.emit('event:message', newMessageMain);
                console.log(newMessageMain);
            }));
            socket.on('event:messageThread', (messageThread) => __awaiter(this, void 0, void 0, function* () {
                const newMessageThread = new threadMessage_1.default(messageThread);
                (0, kafka_1.sendMessage)('messageThread', messageThread);
                yield newMessageThread.save();
                io.emit('event:message', newMessageThread);
                console.log(newMessageThread);
            }));
        });
    }
    get Io() {
        return this.io;
    }
}
exports.default = SocketService;
