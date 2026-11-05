import axios from 'axios';
import { Application } from 'express';

import { Task } from '../types/task';

const API_URL = 'http://localhost:4000';

export default function (app: Application): void {
  app.get('/', async (req, res) => {
    try {
      const response = await axios.get<Task[]>(`${API_URL}/api/tasks`);
      res.render('home', { tasks: response.data });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.render('home', { tasks: [] });
    }
  });
}
