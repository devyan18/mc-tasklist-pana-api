import { Document, Schema, model } from 'mongoose';
import { tagColors } from '../validations/task.validations';

type Tag = Document & {
  name: string;
  color: string;
};

export const tagSchema = new Schema<Tag>(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    color: {
      type: String,
      enum: tagColors,
      required: false,
    },
  },
  { timestamps: true },
);

tagSchema.pre('save', function (next) {
  if (!this.color) {
    // select a random color
    const randomIndex = Math.floor(Math.random() * tagColors.length);
    this.color = tagColors[randomIndex];
  }
  next();
});

export const Tag = model<Tag>('Tag', tagSchema);
