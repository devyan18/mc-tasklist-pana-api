import { Document, Schema, model } from 'mongoose';
import { config } from '../settings/config';

type IItem = Document & {
  name: string;
  image: string;
  mod: string;
};

const itemSchema = new Schema<IItem>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    mod: {
      type: String,
      default: 'Minecraft',
    },
  },
  {
    timestamps: true,
  },
);

itemSchema.pre('save', function (next) {
  if (!this.mod) {
    this.mod = 'Minecraft';
  }

  const protocol = config.protocol || 'http';
  const host = config.hostname || 'localhost';
  const port = config.port ? `:${config.port}` : '';

  const imagePath = `${protocol}://${host}${port}${this.image}`;
  this.image = imagePath;

  next();
});

export const Item = model<IItem>('Item', itemSchema);
