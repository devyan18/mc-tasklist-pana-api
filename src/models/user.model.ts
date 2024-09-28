import { model, Schema, Document } from 'mongoose';
import { hashStr } from '../utils/crypt';

type IUser = {
  username: string;
  email: string;
  password: string;
};

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const hashed = await hashStr(this.get('password'));

  this.password = hashed;

  next();
});

export type UserDocument = IUser & Document;

declare global {
  namespace Express {
    interface Request {
      user: UserDocument;
    }
  }
}

export const User = model('User', userSchema);
