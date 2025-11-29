import { Schema, model, Document, Types } from 'mongoose';

export type UserRole = 'guest' | 'user' | 'admin';

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  projects: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['guest', 'user', 'admin'], default: 'user', index: true },
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
}, { timestamps: true });

// compound/indexes can be added here as needed

export default model<IUserDocument>('User', UserSchema);
