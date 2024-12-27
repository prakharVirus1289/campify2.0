// src/models/User.ts
import mongoose, { Schema, Document } from "mongoose";

interface ISubject extends Document {
  subjectId: string;
  subjectName: string;
  subjectDescription: string;
  subjectCode: string;
  subjectMedia: Buffer | null;
  subjectCreatedby: string;
  subjectCreatedon: string;
}

const subjectSchema = new Schema<ISubject>({
  subjectId: { type: String, required: true, unique: true },
  subjectName: { type: String},
  subjectDescription: { type: String},
  subjectCode: { type: String},
  subjectMedia: { type: Buffer},
  subjectCreatedby: { type: String, required: true },
  subjectCreatedon: { type: String, required: true },
});

const Subject = mongoose.model<ISubject>("Subject", subjectSchema);

export default Subject;
