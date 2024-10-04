import { QuickTask } from '../models/quick-task.model';

type QuickTaskCreatorData = {
  title: string;
  items: string[];
  creator: string;
};

export class QuickTaskService {
  static QuickTaskModel = QuickTask;

  static async createQuickTask(data: QuickTaskCreatorData) {
    return this.QuickTaskModel.create(data);
  }

  static async getQuickTasks() {
    return this.QuickTaskModel.find().populate('items').sort({ updatedAt: -1 });
  }

  static async getQuickTaskById(id: string) {
    return this.QuickTaskModel.findById(id).populate('items');
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
