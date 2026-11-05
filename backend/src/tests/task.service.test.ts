jest.mock('../lib/prisma', () => ({
  __esModule: true,
  default: {
    task: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import prisma from '../lib/prisma';
import * as taskService from '../services/task.service';
import { AppError } from '../middleware/errorHandler';

const mockTask = {
  id: 1,
  title: 'Review documents',
  description: 'Check all case files',
  status: 'TODO',
  dueDate: new Date('2024-12-31T17:00:00.000Z'),
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Task Service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      (prisma.task.findMany as jest.Mock).mockResolvedValue([mockTask]);
      const tasks = await taskService.getAllTasks();
      expect(tasks).toHaveLength(1);
      expect(prisma.task.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no tasks exist', async () => {
      (prisma.task.findMany as jest.Mock).mockResolvedValue([]);
      const tasks = await taskService.getAllTasks();
      expect(tasks).toEqual([]);
    });
  });

  describe('getTaskById', () => {
    it('should return a task when found', async () => {
      (prisma.task.findUnique as jest.Mock).mockResolvedValue(mockTask);
      const task = await taskService.getTaskById(1);
      expect(task).toEqual(mockTask);
      expect(prisma.task.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw a 404 AppError when task is not found', async () => {
      (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(taskService.getTaskById(999)).rejects.toThrow(AppError);
      await expect(taskService.getTaskById(999)).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('createTask', () => {
    it('should create and return a task', async () => {
      (prisma.task.create as jest.Mock).mockResolvedValue(mockTask);
      const task = await taskService.createTask({
        title: 'Review documents',
        description: 'Check all case files',
        status: 'TODO',
        dueDate: '2024-12-31T17:00:00.000Z',
      });
      expect(task).toEqual(mockTask);
      expect(prisma.task.create).toHaveBeenCalledTimes(1);
    });

    it('should default status to TODO if not provided', async () => {
      (prisma.task.create as jest.Mock).mockResolvedValue(mockTask);
      await taskService.createTask({
        title: 'Review documents',
        status: 'TODO',
        dueDate: '2024-12-31T17:00:00.000Z',
      });
      expect(prisma.task.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'TODO' }),
        }),
      );
    });
  });

  describe('updateTaskStatus', () => {
    it('should update and return the task with the new status', async () => {
      (prisma.task.findUnique as jest.Mock).mockResolvedValue(mockTask);
      (prisma.task.update as jest.Mock).mockResolvedValue({ ...mockTask, status: 'IN_PROGRESS' });
      const task = await taskService.updateTaskStatus(1, { status: 'IN_PROGRESS' });
      expect(task.status).toBe('IN_PROGRESS');
    });

    it('should throw a 404 AppError if the task does not exist', async () => {
      (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(taskService.updateTaskStatus(999, { status: 'DONE' })).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      (prisma.task.findUnique as jest.Mock).mockResolvedValue(mockTask);
      (prisma.task.delete as jest.Mock).mockResolvedValue(mockTask);
      await expect(taskService.deleteTask(1)).resolves.toBeUndefined();
      expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw a 404 AppError if the task does not exist', async () => {
      (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(taskService.deleteTask(999)).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
