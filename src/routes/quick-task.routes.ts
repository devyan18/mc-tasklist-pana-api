import { Router } from 'express';
import { QuickTaskService } from '../services/quick-task.service';
import { validate } from '../middlewares/validate';
import { createQuickTaskSchema } from '../validations/quick-task.validations';
import { authGuard } from '../guards/auth.guard';

const quickTaskRouter = Router();

quickTaskRouter.get('/', authGuard, async (_req, res) => {
  try {
    const quickTasks = await QuickTaskService.getQuickTasks();
    res.json(quickTasks);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: 'Error fetching quick tasks',
    });
  }
});

quickTaskRouter.post(
  '/',
  authGuard,
  validate({
    body: createQuickTaskSchema,
  }),
  async (req, res) => {
    try {
      const { title, items } = req.body;

      const userId = req.user.id;

      const quickTask = await QuickTaskService.createQuickTask({
        title,
        items,
        creator: userId,
      });

      res.json(quickTask);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'Error creating quick task',
      });
    }
  },
);

quickTaskRouter.get('/:quickTaskId', authGuard, async (req, res) => {
  try {
    const { quickTaskId } = req.params;
    const quickTask = await QuickTaskService.getQuickTaskById(quickTaskId);

    if (!quickTask) {
      res.status(404).json({
        message: 'Quick task not found',
      });
      return;
    }

    res.json(quickTask);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: 'Error fetching quick task',
    });
  }
});

quickTaskRouter.patch(
  '/:quickTaskId',
  authGuard,
  validate({
    body: createQuickTaskSchema,
  }),
  async (req, res) => {
    try {
      const { title, items } = req.body;
      const { quickTaskId } = req.params;

      const quickTask = await QuickTaskService.updateQuickTask(quickTaskId, {
        title,
        items,
      });

      res.json(quickTask);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'Error updating quick task',
      });
    }
  },
);

export { quickTaskRouter };
