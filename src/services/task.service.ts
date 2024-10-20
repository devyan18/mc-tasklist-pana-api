import { Task } from '../models/task.model';
import { TagService } from './tag.service';

type TaskCreatorData = {
  title: string;
  done?: boolean;
  description: string;
  creator: string;
  tags: [
    {
      name: string;
      color: string;
    },
  ];
  items: string[];
  priority: string;
  links?: { url: string; title: string }[];
};

export class TaskService {
  static TaskModel = Task;

  static async createTask(data: TaskCreatorData) {
    console.log({ createTaskData: data });
    const tags = await TagService.createManyOrGetIds(data.tags);

    return this.TaskModel.create({
      ...data,
      tags,
    });
  }

  static async getTasks() {
    return this.TaskModel.find()
      .populate('creator')
      .populate('items')
      .populate('tags')
      .sort({ updatedAt: -1 });
  }

  static async getTaskById(id: string) {
    return this.TaskModel.findById(id)
      .populate('creator')
      .populate('items')
      .populate('tags');
  }

  static async updateTask(id: string, data: Partial<TaskCreatorData>) {
    const tags = await TagService.createManyOrGetIds(data.tags || []);

    return this.TaskModel.findByIdAndUpdate(
      id,
      {
        ...data,
        tags,
      },
      { new: true },
    )
      .populate('creator')
      .populate('items');
  }

  static async deleteTask(id: string, creatorId: string) {
    return this.TaskModel.findOneAndDelete({
      _id: id,
      creator: creatorId,
    });
  }
}
