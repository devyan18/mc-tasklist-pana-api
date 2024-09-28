import { Document, Schema, Types, model } from 'mongoose';

type Priority = 'low' | 'medium' | 'high';

type Link = {
  url: string;
  title: string;
};

type ITask = Document & {
  title: string;
  description: string;
  done: boolean;
  tags: string[];
  creator: Types.ObjectId;
  priority: Priority;
  links: Link[];
};

const priorityValues = Object.values(['low', 'medium', 'high']) as Priority[];

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    priority: {
      type: String,
      enum: priorityValues,
      default: 'low',
    },
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
  },
  {
    timestamps: true,
  },
);

export const Task = model<ITask>('Task', taskSchema);
