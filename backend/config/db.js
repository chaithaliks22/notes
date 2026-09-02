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

  // 1. Try configured cloud MongoDB Atlas URI
  if (uri && uri !== 'your_mongodb_connection_string') {
    try {
      console.log('Connecting to configured MongoDB URI...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
      });
      console.log(`MongoDB connected successfully: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error(`MongoDB Atlas connection failed: ${err.message}`);
      console.log('Will keep server online to serve static pages and retry on incoming requests.');
      return;
    }
  }

  // 2. Try local MongoDB daemon
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/notes-app', {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`MongoDB connected successfully (Local): ${conn.connection.host}`);
    return conn;
  } catch (localErr) {
    console.log('Local MongoDB not running.');
  }

  // 3. Fallback to in-memory MongoDB for local dev testing
  try {
    console.log('Attempting lightweight in-memory MongoDB instance for development...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create({
      binary: {
        version: '7.0.14',
      },
    });
    const memoryUri = mongod.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`MongoDB connected successfully (In-Memory DB): ${conn.connection.host}`);
    return conn;
  } catch (memErr) {
    console.warn('\n=============================================================');
    console.warn('⚠️ NOTICE: MongoDB is not connected yet.');
    console.warn('Please add the MONGO_URI environment variable on Render:');
    console.warn('1. Go to Render Dashboard -> Your Service -> Environment');
    console.warn('2. Key: MONGO_URI');
    console.warn('3. Value: mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/notes-app');
    console.warn('=============================================================\n');
  }
};
