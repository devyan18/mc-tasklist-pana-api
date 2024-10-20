import { Router } from 'express';
import { TaskService } from '../services/task.service';
import { validate } from '../middlewares/validate';
import {
  createTaskSchema,
  updateTaskSchema,
} from '../validations/task.validations';
import { authGuard } from '../guards/auth.guard';

const taskRouter = Router();

taskRouter.get('/', authGuard, async (_req, res) => {
  try {
    const tasks = await TaskService.getTasks();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: 'Error fetching tasks',
    });
  }
});

taskRouter.post(
  '/',
  authGuard,
  validate({
    body: createTaskSchema,
  }),
  async (req, res) => {
    try {
      const { title, description, priority, tags, links, items } = req.body;
      const creator = req.user.id;
      console.log(tags);
      const task = await TaskService.createTask({
        title,
        description,
        creator,
        priority,
        tags,
        links,
        items,
      });

      res.json(task);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'Error creating task',
      });
    }
  },
);

taskRouter.patch(
  '/:taskId',
  authGuard,
  validate({
    body: updateTaskSchema,
  }),
  async (req, res) => {
    try {
      const { title, description, priority, tags, links, items, done } =
        req.body;
      const taskId = req.params.taskId;

      const task = await TaskService.updateTask(taskId, {
        title,
        description,
        priority,
        tags,
        links,
        items,
        done,
      });

      res.json(task);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'Error updating task',
      });
    }
  },
);

taskRouter.get('/:taskId', authGuard, async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await TaskService.getTaskById(taskId);

    if (!task) {
      res.status(404).json({
        message: 'Task not found',
      });
      return;
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: 'Error fetching task',
    });
  }
});

taskRouter.delete('/:taskId', authGuard, async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    await TaskService.deleteTask(taskId, userId);

    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: 'Error deleting task',
    });
  }
});

export { taskRouter };
