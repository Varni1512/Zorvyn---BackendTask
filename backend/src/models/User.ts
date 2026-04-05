import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  VIEWER = 'Viewer',
  ANALYST = 'Analyst',
  ADMIN = 'Admin',
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional if using OAuth, but we use JWT
    role: { 
      type: String, 
      enum: Object.values(UserRole), 
      default: UserRole.VIEWER 
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
