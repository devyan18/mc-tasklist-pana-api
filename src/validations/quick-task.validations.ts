import z from 'zod';

export const createQuickTaskSchema = z.object({
  title: z.string().min(3),
  done: z.boolean().optional(),
  items: z.array(z.string()).optional(),
});

export const updateQuickTaskSchema = z.object({
  title: z.string().min(3).optional(),
  done: z.boolean().optional(),
  items: z.array(z.string()).optional(),
});
