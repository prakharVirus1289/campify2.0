import mongoose, { Schema, Document } from "mongoose";

interface IThreadMessage extends Document {
    threadId: string;
    messageId: string;
    subjectId: string;
    content: string;
    codeData: string;
    codeLanguage: string;
    media: Buffer | null;
    createdby: string;
    createdon: string;
}

const threadMessageSchema = new Schema<IThreadMessage>({
  threadId: { type: String, required: true, unique: true },
  messageId: { type: String, required: true },
  subjectId: { type: String, required: true },
  content: { type: String },
  codeData: { type: String },
  codeLanguage: { type: String },
  media: { type: Buffer },
  createdby: { type: String, required: true },
  createdon: { type: String, required: true },
});

const ThreadMessage = mongoose.model<IThreadMessage>("ThreadMessage", threadMessageSchema);

export default ThreadMessage;