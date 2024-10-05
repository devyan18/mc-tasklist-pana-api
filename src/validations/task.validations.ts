import z from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(6),
  tags: z.array(z.string()).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(6).optional(),
  tags: z.array(z.string()).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  items: z.array(z.string()).optional(),
  done: z.boolean().optional(),
  links: z
    .array(
      z.object({
        title: z.string(),
        url: z.string(),
      }),
    )
    .optional(),
});
