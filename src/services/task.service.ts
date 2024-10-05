import { Task } from '../models/task.model';

type TaskCreatorData = {
  title: string;
  done?: boolean;
  description: string;
  creator: string;
  tags?: string[];
  items: string[];
  priority: string;
  links?: { url: string; title: string }[];
};

export class TaskService {
  static TaskModel = Task;

  static async createTask(data: TaskCreatorData) {
    return this.TaskModel.create(data);
  }

  static async getTasks() {
    return this.TaskModel.find()
      .populate('creator')
      .populate('items')
      .sort({ updatedAt: -1 });
  }

  static async getTaskById(id: string) {
    return this.TaskModel.findById(id).populate('creator').populate('items');
  }

  static async updateTask(id: string, data: Partial<TaskCreatorData>) {
    console.log(data);
    return this.TaskModel.findByIdAndUpdate(id, data, { new: true })
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
