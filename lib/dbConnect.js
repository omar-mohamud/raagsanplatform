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
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000, // 15 second timeout
      connectTimeoutMS: 20000, // 20 second timeout
      socketTimeoutMS: 45000, // 45 second timeout
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionRetryDelayMS: 5000, // How long to wait between retries
      heartbeatFrequencyMS: 10000, // Send a ping every 10 seconds
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    }).catch((error) => {
      console.warn('❌ MongoDB connection failed:', error.message);
      // Clear the promise so we can retry next time
      cached.promise = null;
      // Return null to indicate connection failed
      return null;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Function to reset the connection cache (useful for testing)
export function resetConnection() {
  if (cached.conn) {
    cached.conn = null;
  }
  if (cached.promise) {
    cached.promise = null;
  }
}
