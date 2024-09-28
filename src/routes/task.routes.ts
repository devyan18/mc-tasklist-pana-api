import { Router } from 'express';
import { TaskService } from '../services/task.service';

const taskRouter = Router();

taskRouter.post('/', async (req, res) => {
  try {
    const { title, description, priority, tags, links } = req.body;
    const creator = req.user.id;

    const task = await TaskService.createTask({
      title,
      description,
      creator,
      priority,
      tags,
      links,
    });

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: 'Error creating task',
    });
  }
});

export { taskRouter };
