import express from 'express';
import connectDB from './mongoDB/db';
import http from 'http'
import SocketService from './socketIO/socket';
import { startMessageConsumer } from './kafka/kafka';

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function init() {
  startMessageConsumer();
  const socketService = new SocketService();
  
  const httpserver = http.createServer();
  const PORT = 3000;

  socketService.Io.attach(httpserver);
  httpserver.listen(PORT, () => {
    console.log(`database: Server is running on port ${PORT}`);
  });

  socketService.initListener();
}
init()