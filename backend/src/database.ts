import express from 'express';
// import multer from 'multer';
// import Subject from './mongoDB/subject';
import connectDB from './mongoDB/db';
import http from 'http'
import SocketService from './socketIO/socket';
import { startMessageConsumer } from './kafka/kafka';

const app = express();

connectDB();

// const upload = multer({storage: multer.memoryStorage()})

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

// app.use(cors({
//   origin: 'http://localhost:5173',
//   methods: ['GET', 'POST', 'PUT', 'DELETE']
// }));

// const prisma = new PrismaClient();

// app.post('/subjects', async (req, res) => {
//   const {id, name, description, createdBy} = req.body;
//   console.log(req.body);
//   const newSubject = await prisma.subjects.create({
//       data: {id: id, name: name, description: description, createdBy: createdBy}
//   });
//   res.json(newSubject);
// });

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });

// app.post('/m_messages', upload.single('media'), async (req, res) => {
//   const {id, title, content, code, code_language, subject_ID, createdBy} = req.body;
//   console.log(req.file);
//   console.log(req.body);
  // const media_ = req.file?.buffer;
  // if (!media_) {
  //   res.status(400).json({error: 'No media file provided'});
  //   return;
  // }
  // const newMessage = await prisma.m_messages.create({
  //     data: {id: id, title: title, content: content, code: code, code_language: code_language, media: media_, subject_ID: subject_ID, createdBy: createdBy}
  // });
  // res.json(newMessage);
// });

// async function main() {
//   // Create a new user
//   const newUser = await prisma.subjects.create({
//     data: {
//       email: 'johndoe@example.com',
//       name: 'John Doe',
//     },
//   });

//   console.log('Created new user:', newUser);

//   // Fetch all users
//   const users = await prisma.user.findMany();
//   console.log('All users:', users);
// }

// main()
//   .catch((e) => {
//     throw e;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

// app.post('/messagepost', upload.single('file'), async (req, res) => {
//   // const {message} = req.body;
//   console.log(req.file);
//   console.log(req.body);
//   const user = new User({
//     message: req.body.message,
//     data: req.file?.buffer
//   });
//   console.log(user);
//   await user.save();
//   res.json(user);
// });

// app.get('/messageget', async (req, res) => {
//   const users = await User.find({});
//   console.log(users);
//   res.json(users);
// });