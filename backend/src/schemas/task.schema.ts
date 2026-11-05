import { z } from 'zod';

export const StatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'DONE']);

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be 200 characters or fewer'),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or fewer')
    .optional(),
  status: StatusEnum.optional().default('TODO'),
  dueDate: z
    .string()
    .datetime('Due date must be a valid ISO 8601 date'),
});

export const updateStatusSchema = z.object({
  status: StatusEnum,
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;