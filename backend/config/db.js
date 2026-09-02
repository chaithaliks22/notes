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
      console.log('Local MongoDB not running. Initializing lightweight in-memory MongoDB instance (v7.0.14)...');
      
      try {
        // Dynamic import to allow smooth execution even if memory server isn't used in production
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create({
          binary: {
            version: '7.0.14',
          },
        });
        const memoryUri = mongod.getUri();
        const conn = await mongoose.connect(memoryUri);
        console.log(`MongoDB connected successfully (In-Memory DB): ${conn.connection.host}`);
        console.log('Tip: Set MONGO_URI in Environment Variables to connect to MongoDB Atlas.');
      } catch (memErr) {
        console.error('\n=============================================================');
        console.error('❌ MONGODB CONNECTION ERROR:');
        console.error('No external MongoDB connection was provided.');
        console.error('Please configure the MONGO_URI environment variable on Render:');
        console.error('1. Go to Render Dashboard -> Your Service -> Environment');
        console.error('2. Add Key: MONGO_URI');
        console.error('3. Add Value: mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/notes-app');
        console.error('=============================================================\n');
        throw memErr;
      }
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
