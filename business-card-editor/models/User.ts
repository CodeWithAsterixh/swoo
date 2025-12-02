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
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true,
    lowercase: true,
    trim: true,
  },
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
    console.log('[User.pre.save] Hashing password for user:', this.email);
    const salt = await bcryptjs.genSalt(10);
    this.passwordHash = await bcryptjs.hash(this.passwordHash, salt);
    console.log('[User.pre.save] Password hashed successfully');
  } catch (error) {
    console.error('[User.pre.save] Error hashing password:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  console.log('[comparePassword] Comparing password for user:', this.email);
  console.log('[comparePassword] Has passwordHash:', !!this.passwordHash);
  console.log('[comparePassword] CandidatePassword length:', candidatePassword?.length);
  const result = await bcryptjs.compare(candidatePassword, this.passwordHash);
  console.log('[comparePassword] Comparison result:', result);
  return result;
};

export default model<IUserDocument>('User', UserSchema);
