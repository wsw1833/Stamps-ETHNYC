import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { cache } from 'react';

dotenv.config();

// MongoDB connection URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'undefined';

if (MONGODB_URI === 'undefined') {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Connection options
const options: mongoose.ConnectOptions = {
  autoIndex: true,
};

class DatabaseConnection {
  private static instance: DatabaseConnection;

  private constructor() {
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connection established successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB connection disconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<typeof mongoose> {
    if (mongoose.connection.readyState === 1) {
      return mongoose;
    }

    try {
      await mongoose.connect(MONGODB_URI, options);
      return mongoose;
    } catch (error) {
      console.error('Failed to connect to MongoDB', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('MongoDB connection closed');
    }
  }

  public getConnection(): typeof mongoose {
    return mongoose;
  }
}

interface ConnectionCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use a global variable to track the connection across hot reloads in development
const globalConnectionCache: ConnectionCache = (global as any)
  .mongooseConnection || {
  conn: null,
  promise: null,
};

// Update the global variable in development to avoid multiple connections
if (process.env.NODE_ENV !== 'production') {
  (global as any).mongooseConnection = globalConnectionCache;
}

const connectDB = cache(async (): Promise<typeof mongoose> => {
  if (globalConnectionCache.conn) {
    return globalConnectionCache.conn;
  }

  if (!globalConnectionCache.promise) {
    const dbConnection = DatabaseConnection.getInstance();
    globalConnectionCache.promise = dbConnection.connect();
  }

  try {
    globalConnectionCache.conn = await globalConnectionCache.promise;
  } catch (error) {
    globalConnectionCache.promise = null;
    throw error;
  }

  return globalConnectionCache.conn;
});

export default connectDB;
