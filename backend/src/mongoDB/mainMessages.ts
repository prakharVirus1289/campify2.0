import mongoose, { Schema, Document } from "mongoose";

interface IMainMessage extends Document {
  messageId: string;
  subjectId: string;
  title: string;
  description: string;
  codeData: string;
  codeLanguage: string;
  media: Buffer | null;
  createdby: string;
  createdon: string;
}

const mainMessageSchema = new Schema<IMainMessage>({
  messageId: { type: String, required: true, unique: true },
  subjectId: { type: String, required: true },
  title: { type: String },
  description: { type: String },
  codeData: { type: String },
  codeLanguage: { type: String },
  media: { type: Buffer },
  createdby: { type: String, required: true },
  createdon: { type: String, required: true },
});

const MainMessage = mongoose.model<IMainMessage>("MainMessage", mainMessageSchema);

export default MainMessage;