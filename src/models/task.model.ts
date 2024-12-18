import { Document, Schema, Types, model } from 'mongoose';

type Priority = 'low' | 'medium' | 'high';

type Link = {
  url: string;
  title: string;
};

type Task = Document & {
  title: string;
  description: string;
  icon: string | null;
  done: boolean;
  tags: string[];
  creator: Types.ObjectId;
  priority: Priority;
  items: Types.ObjectId[];
  links: Link[];
  assignedTo: Types.ObjectId;
};

const taskSchema = new Schema<Task>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
      default: null,
    },
    done: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Item',
      },
    ],
    links: [
      {
        url: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
      },
    ],
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

taskSchema.pre('save', function (next) {
  // add enpty array for tags
  if (!this.tags) {
    this.tags = [];
  }

  if (!this.items) {
    this.items = [];
  }

  if (!this.links) {
    this.links = [];
  }

  next();
});

export const Task = model<Task>('Task', taskSchema);
