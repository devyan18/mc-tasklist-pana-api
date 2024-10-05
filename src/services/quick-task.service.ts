import { QuickTask } from '../models/quick-task.model';

type QuickTaskCreatorData = {
  title: string;
  items: string[];
  creator: string;
};

export class QuickTaskService {
  static QuickTaskModel = QuickTask;

  static async createQuickTask(data: QuickTaskCreatorData) {
    const newQuickTask = await this.QuickTaskModel.create(data);
    return QuickTaskService.getQuickTaskById(newQuickTask.id);
  }

  static async getQuickTasks() {
    return this.QuickTaskModel.find()
      .populate('items')
      .populate('creator')
      .sort({ updatedAt: -1 });
  }

  static async getQuickTaskById(id: string) {
    return this.QuickTaskModel.findById(id)
      .populate('items')
      .populate('creator');
  }

  static async updateQuickTask(
    id: string,
    data: Partial<QuickTaskCreatorData>,
  ) {
    return this.QuickTaskModel.findByIdAndUpdate(id, data, {
      new: true,
    }).populate('items');
  }
}
