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
  // Always try to connect, don't rely on cached connection if it's null
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Clear cache if connection is not ready
  if (cached.conn && mongoose.connection.readyState !== 1) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000, // 30 second timeout
      connectTimeoutMS: 30000, // 30 second timeout
      socketTimeoutMS: 60000, // 60 second timeout
      maxPoolSize: 5, // Reduce pool size for stability
      heartbeatFrequencyMS: 10000, // Send a ping every 10 seconds
      retryWrites: true,
      retryReads: true,
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    };

    console.log('🔄 Attempting MongoDB connection...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      cached.conn = mongoose;
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection failed:', error.message);
      console.error('Error details:', error);
      // Clear the promise so we can retry next time
      cached.promise = null;
      cached.conn = null;
      throw error; // Re-throw the error instead of returning null
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // If connection fails, clear cache and throw error
    cached.conn = null;
    cached.promise = null;
    throw error;
  }
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
