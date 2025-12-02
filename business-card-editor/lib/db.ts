/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/business-card-editor';

const cached: { conn: typeof mongoose | null } = { conn: null };

export async function connectDb() {
  if (cached.conn) return cached.conn;

  const opts = {
    // How long to try selecting a server before failing (ms)
    serverSelectionTimeoutMS: 5000,
    // How long to wait for initial connection (ms)
    connectTimeoutMS: 10000,
    // Keep sockets alive for long-running operations
    socketTimeoutMS: 45000,
  } as any;
  
  // Always explicitly set the database name to 'swoocards'
  // MongoDB Atlas URIs don't include the database name by default
  opts.dbName = 'swoocards';

  try {
    // Helpful log for debugging connection errors in dev
    console.log('[db] connecting to MongoDB (using MONGODB_URI)');
    console.log('[db] target database: swoocards');

    const conn = await mongoose.connect(MONGO_URI, opts);

    console.log('[db] MongoDB connected to database:', conn.connection.name || 'swoocards');

    cached.conn = conn;
    return conn;
  } catch (err) {
    console.error('[db] MongoDB connection error:', err);
    // don't cache failed connection
    throw err;
  }
}

export default connectDb;
