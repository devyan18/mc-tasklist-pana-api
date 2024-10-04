import z from 'zod';

export const createItemSchema = z.object({
  name: z.string().min(3),
  mod: z.string().optional(),
  image: z.string().optional(),
});
