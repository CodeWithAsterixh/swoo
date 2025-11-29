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
  // If the connection string does not include a database name, default to `swoocards`.
  // This prevents the driver from writing to the `test` database when the URI lacks a DB.
  const defaultDb = process.env.MONGODB_DB || 'swoocards';
  const hasDbInUri = (() => {
    try {
      // Match a path segment after the host in the URI (e.g. /mydb or /mydb?opts)
      const m = MONGO_URI.match(/\/([^/?]+)(?=(\?|$))/);
      return !!(m && m[1] && m[1].length > 0);
    } catch {
      return false;
    }
  })();

  if (!hasDbInUri) {
    opts.dbName = defaultDb;
  }

  try {
    // Helpful log for debugging connection errors in dev
    console.log('[db] connecting to MongoDB', MONGO_URI ? '(using MONGODB_URI)' : '(using default)');

    const conn = await mongoose.connect(MONGO_URI, opts);

    console.log('[db] MongoDB connected');

    cached.conn = conn;
    return conn;
  } catch (err) {
    console.error('[db] MongoDB connection error:', err);
    // don't cache failed connection
    throw err;
  }
}

export default connectDb;
