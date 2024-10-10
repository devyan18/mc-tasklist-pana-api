import { Item } from '../models/item.model';

type ItemCreatorData = {
  name: string;
  image: string;
  mod?: string;
};

export class ItemService {
  static ItemModel = Item;

  static async createItem(data: ItemCreatorData) {
    return this.ItemModel.create(data);
  }

  static async getItems({ page = 1, limit = 10 }) {
    console.log({
      page,
      limit,
    });
    const items = await this.ItemModel.find().sort({ createdAt: -1 }).exec();

    return items.slice(0, limit);
  }

  static async getItemById(itemId: string) {
    return this.ItemModel.findById(itemId);
  }
}
