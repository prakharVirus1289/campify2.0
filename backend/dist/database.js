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
const express_1 = __importDefault(require("express"));
// import multer from 'multer';
// import Subject from './mongoDB/subject';
const db_1 = __importDefault(require("./mongoDB/db"));
const http_1 = __importDefault(require("http"));
const socket_1 = __importDefault(require("./socketIO/socket"));
const kafka_1 = require("./kafka/kafka");
const app = (0, express_1.default)();
(0, db_1.default)();
// const upload = multer({storage: multer.memoryStorage()})
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        (0, kafka_1.startMessageConsumer)();
        const socketService = new socket_1.default();
        const httpserver = http_1.default.createServer();
        const PORT = 3000;
        socketService.Io.attach(httpserver);
        httpserver.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        socketService.initListener();
    });
}
init();
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
