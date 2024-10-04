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

  static async getItems() {
    return this.ItemModel.find().sort({ createdAt: -1 });
  }

  static async getItemById(itemId: string) {
    return this.ItemModel.findById(itemId);
  }
}
