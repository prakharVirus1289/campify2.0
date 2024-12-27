import { Server } from 'socket.io';
import { sendMessage, functionToGetIo } from '../kafka/kafka';
import Subject from '../mongoDB/subject';
import MessageMain from '../mongoDB/mainMessages';
import MessageThread from '../mongoDB/threadMessage';

class SocketService {
    private io: Server;
    constructor() {
        this.io = new Server({
            cors: {
                origin: 'http://localhost:5173',
                methods: ['GET', 'POST', 'PUT', 'DELETE']
            }
        });
        functionToGetIo(this.io);
    }

    public initListener () {
        const io = this.io;

        io.on('connect', (socket) => {
            console.log('socket: Client connected to socket ', socket.id);
            socket.on('event:subject', async (subject) => {
                console.log("socket: subject before sendMessage------>", subject);
                sendMessage("subjects", subject);
                console.log("socket: subject after sendMessage------>", subject);
                // await newSubject.save();
                // io.emit('event:message', newSubject);
                console.log("socket: newSubject------>", subject);
            });
            socket.on('event:messageMain', async (messageMain) => {
                sendMessage('messagesMain', messageMain);
                // await newMessageMain.save();
                // io.emit('event:message', newMessageMain);
                console.log("socket: messageMain------>", messageMain);
            });
            socket.on('event:messageThread', async (messageThread) => {
                sendMessage('messagesThread', messageThread)
                // await newMessageThread.save();
                // io.emit('event:message', newMessageThread);
                console.log("socket: messageThread------>", messageThread);
            });
            socket.on('event:getMessages', async (message) => {
                console.log("socket: initListener: event:getMessages: incomingMsg------>", message);
                const subjects = await Subject.find({});
                console.log("socket: initListener: event:getMessages: subjects------>", subjects);
                subjects.map((subject) => {
                    io.emit('event:message', subject);
                });
                const messagesMains = await MessageMain.find({});
                console.log("socket: initListener: event:getMessages: messagesMains------>", messagesMains);
                messagesMains.map((messageMain) => {
                    io.emit('event:message', messageMain);
                });
                const messagesThreads = await MessageThread.find({});
                console.log("socket: initListener: event:getMessages: messagesThreads------>", messagesThreads);
                messagesThreads.map((messageThread) => {
                    io.emit('event:message', messageThread);
                });
            });
        });
    }

    get Io(): Server {
        return this.io;
    }
}

export default SocketService;