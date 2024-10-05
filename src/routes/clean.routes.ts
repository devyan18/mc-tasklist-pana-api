import { Router } from 'express';
import { User } from '../models/user.model';
import { QuickTask } from '../models/quick-task.model';
import { Task } from '../models/task.model';
import { Item } from '../models/item.model';

const cleanRouter = Router();

cleanRouter.get('/', async (_req, res) => {
  try {
    await User.deleteMany({});
    await QuickTask.deleteMany({});
    await Task.deleteMany({});
    await Item.deleteMany({});

    res.json({ message: 'Cleaned database' });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: 'Error fetching quick tasks',
    });
  }
});

export { cleanRouter };
