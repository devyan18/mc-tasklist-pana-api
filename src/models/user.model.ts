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
    // Construir la URL completa de la imagen
    const imagePath = `/public/uploads/default-avatar.png`;

    this.avatar = imagePath;
  }
  next();
});

userSchema.virtual('avatarUrl').get(function () {
  const host = config.hostname;

  let temporalAvatar = this.avatar;

  if (this.avatar.startsWith('http')) {
    // remove host from avatar
    temporalAvatar = temporalAvatar.replace('http://localhost:4000', '');
  }

  if (this.avatar.startsWith('https')) {
    temporalAvatar = temporalAvatar.replace(host, '');
  }

  return `${host}${temporalAvatar}`;
});

// add host to avatar pre finds
userSchema.set('toJSON', {
  virtuals: true, // Incluir los campos virtuales en la respuesta
  transform: (doc, ret) => {
    // Sobrescribir el campo avatar con la URL completa generada por el virtual
    ret.avatar = ret.avatarUrl;
    delete ret.avatarUrl; // Eliminar el campo virtual innecesario de la respuesta
    return ret;
  },
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
