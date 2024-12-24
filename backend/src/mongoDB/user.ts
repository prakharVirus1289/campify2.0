// src/models/User.ts
import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  message: string;
  data: Buffer;
}

const userSchema = new Schema<IUser>({
  message: { type: String, required: true },
  data: { type: Buffer, required: true, unique: true },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;