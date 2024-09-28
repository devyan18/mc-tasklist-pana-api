import { Task } from '../models/task.model';

type TaskCreatorData = {
  title: string;
  description: string;
  creator: string;
  tags?: string[];
  priority: string;
  links?: { url: string; title: string }[];
};

export class TaskService {
  static TaskModel = Task;

  static async createTask(data: TaskCreatorData) {
    return this.TaskModel.create(data);
  }

  static async getTasks() {
    return this.TaskModel.find().populate('creator').sort({ createdAt: -1 });
  }
}
