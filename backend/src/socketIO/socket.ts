import { Server } from 'socket.io';
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
    }

    public initListener () {
        const io = this.io;

        io.on('connect', (socket) => {
            console.log('Client connected to socket ', socket.id);
            socket.on('event:subject', async (subject) => {
                const newSubject = new Subject(subject);
                await newSubject.save();
                io.emit('event:message', newSubject);
                console.log(newSubject);
            });
            socket.on('event:messageMain', async (messageMain) => {
                const newMessageMain = new MessageMain(messageMain);
                await newMessageMain.save();
                io.emit('event:message', newMessageMain);
                console.log(newMessageMain);
            });
            socket.on('event:messageThread', async (messageThread) => {
                const newMessageThread = new MessageThread(messageThread);
                await newMessageThread.save();
                io.emit('event:message', newMessageThread);
                console.log(newMessageThread);
            });
        });
    }

    get Io(): Server {
        return this.io;
    }
}

export default SocketService;