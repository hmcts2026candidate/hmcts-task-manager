import request from 'supertest';
import app from '../app';
import * as taskService from '../services/task.service';
import { AppError } from '../middleware/errorHandler';

jest.mock('../services/task.service');

const mockTask = {
  id: 1,
  title: 'Review documents',
  description: 'Check all case files',
  status: 'TODO',
  dueDate: new Date('2024-12-31T17:00:00.000Z'),
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Task Controller', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET /api/tasks', () => {
    it('should return 200 with a list of tasks', async () => {
      (taskService.getAllTasks as jest.Mock).mockResolvedValue([mockTask]);
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('should return 200 with an empty array when no tasks exist', async () => {
      (taskService.getAllTasks as jest.Mock).mockResolvedValue([]);
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return 200 with the task when found', async () => {
      (taskService.getTaskById as jest.Mock).mockResolvedValue(mockTask);
      const res = await request(app).get('/api/tasks/1');
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
    });

    it('should return 400 for a non-numeric ID', async () => {
      const res = await request(app).get('/api/tasks/abc');
      expect(res.status).toBe(400);
    });

    it('should return 404 when task is not found', async () => {
      (taskService.getTaskById as jest.Mock).mockRejectedValue(new AppError(404, 'Task not found'));
      const res = await request(app).get('/api/tasks/999');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/tasks', () => {
    it('should return 201 with the created task', async () => {
      (taskService.createTask as jest.Mock).mockResolvedValue(mockTask);
      const res = await request(app).post('/api/tasks').send({
        title: 'Review documents',
        dueDate: '2024-12-31T17:00:00.000Z',
      });
      expect(res.status).toBe(201);
    });

    it('should return 400 if title is missing', async () => {
      const res = await request(app).post('/api/tasks').send({
        dueDate: '2024-12-31T17:00:00.000Z',
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('should return 400 if dueDate is missing', async () => {
      const res = await request(app).post('/api/tasks').send({
        title: 'Review documents',
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('should return 400 if dueDate is not a valid ISO date', async () => {
      const res = await request(app).post('/api/tasks').send({
        title: 'Review documents',
        dueDate: 'not-a-date',
      });
      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/tasks/:id/status', () => {
    it('should return 200 with the updated task', async () => {
      (taskService.updateTaskStatus as jest.Mock).mockResolvedValue({ ...mockTask, status: 'IN_PROGRESS' });
      const res = await request(app).patch('/api/tasks/1/status').send({ status: 'IN_PROGRESS' });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('IN_PROGRESS');
    });

    it('should return 400 for an invalid status value', async () => {
      const res = await request(app).patch('/api/tasks/1/status').send({ status: 'INVALID' });
      expect(res.status).toBe(400);
    });

    it('should return 404 if task does not exist', async () => {
      (taskService.updateTaskStatus as jest.Mock).mockRejectedValue(new AppError(404, 'Task not found'));
      const res = await request(app).patch('/api/tasks/999/status').send({ status: 'DONE' });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should return 204 on successful deletion', async () => {
      (taskService.deleteTask as jest.Mock).mockResolvedValue(undefined);
      const res = await request(app).delete('/api/tasks/1');
      expect(res.status).toBe(204);
    });

    it('should return 400 for a non-numeric ID', async () => {
      const res = await request(app).delete('/api/tasks/abc');
      expect(res.status).toBe(400);
    });

    it('should return 404 if task does not exist', async () => {
      (taskService.deleteTask as jest.Mock).mockRejectedValue(new AppError(404, 'Task not found'));
      const res = await request(app).delete('/api/tasks/999');
      expect(res.status).toBe(404);
    });
  });
});
