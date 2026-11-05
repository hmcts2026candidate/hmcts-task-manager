import axios, { isAxiosError } from 'axios';
import { Application } from 'express';

const API_URL = 'http://localhost:4000';

export default function (app: Application): void {
  // Show create task form
  app.get('/tasks/create', (req, res) => {
    res.render('tasks/create', { errors: {}, values: {} });
  });

  // Submit create task form
  app.post('/tasks/create', async (req, res) => {
    const { title, description, status, dueDate } = req.body;
    const values = { title, description, status, dueDate };
    const dueDateIso = toIsoDateTime(dueDate);

    try {
      await axios.post(`${API_URL}/api/tasks`, {
        title,
        description: description || undefined,
        status: status || 'TODO',
        dueDate: dueDateIso,
      });
      res.redirect('/');
    } catch (error: unknown) {
      const errors: Record<string, string[]> = isAxiosError(error) ? { ...(error.response?.data?.details || {}) } : {};
      if (!dueDateIso) {
        errors.dueDate = ['Enter a due date and time'];
      }
      if (Object.keys(errors).length === 0) {
        errors.form = ['Sorry, there was a problem creating the task. Try again later.'];
      }
      res.status(errors.form ? 500 : 400).render('tasks/create', { errors, errorList: toErrorList(errors), values });
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

// Browsers send datetime-local as "YYYY-MM-DDTHH:mm". Some (e.g. Firefox) send an empty
// string until both the date and the time are filled in, so treat empty or invalid values as missing.
export function toIsoDateTime(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }
  const date = new Date(value);
  return isNaN(date.getTime()) ? undefined : date.toISOString();
}

// Builds the GOV.UK error summary list, in the same order as the form fields.
const FIELD_ORDER = ['title', 'description', 'status', 'dueDate'];

export function toErrorList(errors: Record<string, string[]>): { text: string; href?: string }[] {
  const list: { text: string; href?: string }[] = [];
  if (errors.form) {
    list.push({ text: errors.form[0] });
  }
  for (const field of FIELD_ORDER) {
    if (errors[field]?.length) {
      list.push({ text: errors[field][0], href: `#${field}` });
    }
  }
  return list;
}
