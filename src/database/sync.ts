import { connect } from 'mongoose';
import { Item } from '../models/item.model';
import { config } from '../settings/config';

export const syncDb = async () => {
  try {
    const existItems = await Item.find();

    if (existItems.length > 0) {
      console.log('Items already exist');
      return;
    }

    await connect(config.uri).then(() => console.log('Database connected'));

    const request = await fetch('https://minecraft-api.vercel.app/api/items');

    if (!request.ok) {
      throw new Error('Error fetching items');
    }

    const data = await request.json();

    console.log(data);

    await Item.insertMany(data);
  } catch (error) {
    console.log(error);
  }
};
