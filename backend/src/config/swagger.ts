import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HMCTS Task Manager API',
      version: '1.0.0',
      description: 'A REST API for managing caseworker tasks',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Review case documents' },
            description: { type: 'string', nullable: true, example: 'Check all supporting files' },
            status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE'], example: 'TODO' },
            dueDate: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateTaskInput: {
          type: 'object',
          required: ['title', 'dueDate'],
          properties: {
            title: { type: 'string', example: 'Review case documents' },
            description: { type: 'string', example: 'Check all supporting files' },
            status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE'], default: 'TODO' },
            dueDate: { type: 'string', format: 'date-time', example: '2024-12-31T17:00:00.000Z' },
          },
        },
        UpdateStatusInput: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE'] },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);