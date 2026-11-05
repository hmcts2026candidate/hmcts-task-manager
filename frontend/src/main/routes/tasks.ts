import axios, { isAxiosError } from 'axios';
import { Application } from 'express';

const API_URL = 'http://localhost:4000';

export default function (app: Application): void {
  // Show create task form
  app.get('/tasks/create', (req, res) => {
    res.render('tasks/create', { errors: null });
  });

  // Submit create task form
  app.post('/tasks/create', async (req, res) => {
    try {
      const { title, description, status, dueDate } = req.body;
      await axios.post(`${API_URL}/api/tasks`, {
        title,
        description: description || undefined,
        status: status || 'TODO',
        dueDate: new Date(dueDate).toISOString(),
      });
      res.redirect('/');
    } catch (error: unknown) {
      const errors = isAxiosError(error) ? error.response?.data?.details || {} : {};
      res.render('tasks/create', { errors });
    }
  });

  // Show update status form
  app.get('/tasks/:id/status', async (req, res) => {
    try {
      const response = await axios.get(`${API_URL}/api/tasks/${req.params.id}`);
      res.render('tasks/update-status', { task: response.data, errors: null });
    } catch (error) {
      res.redirect('/');
    }
  });

  // Submit update status form
  app.post('/tasks/:id/status', async (req, res) => {
    try {
      await axios.patch(`${API_URL}/api/tasks/${req.params.id}/status`, {
        status: req.body.status,
      });
      res.redirect('/');
    } catch (error: unknown) {
      const errors = isAxiosError(error) ? error.response?.data?.details || {} : {};
      const taskResponse = await axios.get(`${API_URL}/api/tasks/${req.params.id}`);
      res.render('tasks/update-status', { task: taskResponse.data, errors });
    }
  });

  // Delete a task
  app.get('/tasks/:id/delete', async (req, res) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${req.params.id}`);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
    res.redirect('/');
  });
}
