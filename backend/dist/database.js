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
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const app = (0, express_1.default)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
const prisma = new client_1.PrismaClient();
app.post('/subjects', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, description, createdBy } = req.body;
    console.log(req.body);
    const newSubject = yield prisma.subjects.create({
        data: { id: id, name: name, description: description, createdBy: createdBy }
    });
    res.json(newSubject);
}));
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
app.post('/m_messages', upload.single('media'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, title, content, code, code_language, subject_ID, createdBy } = req.body;
    console.log(req.file);
    console.log(req.body);
    // const media_ = req.file?.buffer;
    // if (!media_) {
    //   res.status(400).json({error: 'No media file provided'});
    //   return;
    // }
    // const newMessage = await prisma.m_messages.create({
    //     data: {id: id, title: title, content: content, code: code, code_language: code_language, media: media_, subject_ID: subject_ID, createdBy: createdBy}
    // });
    // res.json(newMessage);
}));
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
