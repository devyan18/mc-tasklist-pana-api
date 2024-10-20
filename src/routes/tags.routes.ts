import { Router } from 'express';
import { TagService } from '../services/tag.service';

import { authGuard } from '../guards/auth.guard';

const tagRouter = Router();

tagRouter.get('/', authGuard, async (req, res) => {
  try {
    const allTags = await TagService.getAllTags();

    res.status(200).json({
      tags: allTags,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Error to getting tags',
    });
  }
});

tagRouter.patch('/:tagId', authGuard, async (req, res) => {
  try {
    const { tagId } = req.params;

    const { color, name } = req.body;

    const updatedTag = await TagService.updateTagColor(tagId, {
      color,
      name,
    });

    res.status(200).json({
      tag: updatedTag,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Error to updating tag',
    });
  }
});

export { tagRouter };
