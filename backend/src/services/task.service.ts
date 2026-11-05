import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { CreateTaskInput, UpdateStatusInput } from '../schemas/task.schema';

export const getAllTasks = async () => {
  return prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const getTaskById = async (id: number) => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) throw new AppError(404, `Task with ID ${id} not found`);
  return task;
};

export const createTask = async (data: CreateTaskInput) => {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status ?? 'TODO',
      dueDate: new Date(data.dueDate),
    },
  });
};

export const updateTaskStatus = async (id: number, data: UpdateStatusInput) => {
  await getTaskById(id);
  return prisma.task.update({
    where: { id },
    data: { status: data.status },
  });
};

export const deleteTask = async (id: number) => {
  await getTaskById(id);
  await prisma.task.delete({ where: { id } });
};