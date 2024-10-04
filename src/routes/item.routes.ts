import { Router } from 'express';
import { authGuard } from '../guards/auth.guard';
import { ItemService } from '../services/item.service';
import { uploadImage } from '../middlewares/uploadImage';
import { validate } from '../middlewares/validate';
import { createItemSchema } from '../validations/item.validation';

const itemRouter = Router();

itemRouter.get('/', authGuard, async (_req, res) => {
  try {
    const items = await ItemService.getItems();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: 'Error fetching items',
    });
  }
});

itemRouter.post(
  '/',
  authGuard,
  uploadImage('image'),
  validate({
    body: createItemSchema,
  }),
  async (req, res) => {
    try {
      const { name, image, mod } = req.body;

      const item = await ItemService.createItem({
        name,
        image,
        mod,
      });

      res.json(item);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'Error creating item',
      });
    }
  },
);

export { itemRouter };
