import { model, Schema, Document } from 'mongoose';
import { hashStr } from '../utils/crypt';
import { config } from '../settings/config';

type IUser = {
  username: string;
  email: string;
  password: string;
  avatar: string;
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
  avatar: {
    type: String,
    default: '',
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

// add default avatar
userSchema.pre('save', function (next) {
  if (!this.avatar) {
    // Obtener las variables de entorno
    const protocol = config.protocol || 'http';
    const host = config.host || 'localhost';
    const port = config.port ? `:${config.port}` : '';

    // Construir la URL completa de la imagen
    const imagePath = `/public/uploads/default-avatar.png`;
    const imageUrl = `${protocol}://${host}${port}${imagePath}`;

    this.avatar = imageUrl;
  }
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
