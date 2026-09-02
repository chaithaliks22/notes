import mongoose from 'mongoose';

/**
 * Connect to MongoDB database.
 * Supports:
 * 1. MongoDB Atlas (Cloud) via MONGO_URI in .env
 * 2. Local MongoDB daemon (mongodb://127.0.0.1:27017/notes-app)
 * 3. Graceful in-memory fallback (MongoMemoryServer) if no local or Atlas database is available,
 *    ensuring the reviewer/user can run the full CRUD app immediately without manual setup!
 */
export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  try {
    if (uri && uri !== 'your_mongodb_connection_string') {
      console.log('Connecting to configured MongoDB URI...');
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB connected successfully: ${conn.connection.host}`);
      return;
    }

    // Try local MongoDB first
    try {
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/notes-app', {
        serverSelectionTimeoutMS: 2500,
      });
      console.log(`MongoDB connected successfully (Local): ${conn.connection.host}`);
      return;
    } catch (localErr) {
      console.log('Local MongoDB not running. Initializing lightweight in-memory MongoDB instance for development...');
      
      // Dynamic import to allow smooth execution even if memory server isn't used in production
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`MongoDB connected successfully (In-Memory Dev DB): ${conn.connection.host}`);
      console.log('Tip: Set MONGO_URI in backend/.env to connect to MongoDB Atlas or local MongoDB.');
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
