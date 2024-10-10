import { Document, model, ObjectId, Schema } from 'mongoose';

const statusArray = ['active', 'done', 'canceled', 'in-process'] as const;

type Status = (typeof statusArray)[number];

type QuickTaskDocument = Document & {
  title: string;
  status: Status;
  items: string[];
  creator: string | ObjectId;
  sort: number;
};

const quickTaskSchema = new Schema<QuickTaskDocument>({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: statusArray,
    default: statusArray[0],
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Item',
    },
  ],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sort: {
    type: Number,
    default: 0,
  },
});

quickTaskSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      this.sort = await QuickTask.countDocuments({ creator: this.creator });
    } catch (err) {
      if (err instanceof Error) {
        return next(err); // Verifica que err es una instancia de Error
      }
      return next(new Error('Unknown error occurred'));
    }
  }
  next();
});

export const QuickTask = model<QuickTaskDocument>('QuickTask', quickTaskSchema);
