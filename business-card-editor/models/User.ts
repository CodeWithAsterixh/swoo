import { Schema, model, Document, Types } from 'mongoose';
import bcryptjs from 'bcryptjs';

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

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['guest', 'user', 'admin'], default: 'user', index: true },
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
}, { timestamps: true, collection: 'users' });

// Hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) {
    return;
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.passwordHash = await bcryptjs.hash(this.passwordHash, salt);
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcryptjs.compare(candidatePassword, this.passwordHash);
};

export default model<IUserDocument>('User', UserSchema);
