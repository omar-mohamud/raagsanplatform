import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      connectTimeoutMS: 10000, // 10 second timeout
    }).then((mongoose) => mongoose).catch((error) => {
      console.warn('MongoDB connection failed:', error.message);
      // Return null to indicate connection failed
      return null;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
