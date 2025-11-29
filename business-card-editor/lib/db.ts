/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/business-card-editor';

const cached: { conn: typeof mongoose | null } = { conn: null };

export async function connectDb() {
  if (cached.conn) return cached.conn;
  const conn = await mongoose.connect(MONGO_URI, {
    // options can be added here if needed
  } as any);
  cached.conn = conn;
  return conn;
}

export default connectDb;
