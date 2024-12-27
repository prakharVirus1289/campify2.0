import mongoose from 'mongoose';

const connectDB = async () => {
    try {
      await mongoose.connect("mongodb://localhost:27017/mydb");
      console.log("db: MongoDB connected successfully");
    } catch (err) {
      console.error("MongoDB connection error:", err);
      process.exit(1); // Exit process with failure
    }
  };

export default connectDB;