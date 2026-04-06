import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    isConnected = conn.connection.readyState === 1;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
};