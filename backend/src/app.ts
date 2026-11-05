import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import taskRoutes from './routes/task.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/tasks', taskRoutes);

// Global error handler — must be last
app.use(errorHandler);

export default app;