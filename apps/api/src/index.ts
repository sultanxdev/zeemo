import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger } from '@zeemo/shared';
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/error.js';
import { workspaceRouter } from './routes/workspace.js';
import { incidentsRouter } from './routes/incidents.js';
import { runsRouter } from './routes/runs.js';
import { knowledgeRouter } from './routes/knowledge.js';
import { approvalsRouter } from './routes/approvals.js';
import { evalsRouter } from './routes/evals.js';
import { auditRouter } from './routes/audit.js';
import { integrationsRouter } from './routes/integrations.js';
import { rabbitMQClient } from './lib/rabbitmq.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'zeemo-api',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Authentication & Tenant isolation
app.use(authMiddleware);

// API v1 Routes
app.use('/v1/workspaces', workspaceRouter);
app.use('/v1/incidents', incidentsRouter);
app.use('/v1/runs', runsRouter);
app.use('/v1/knowledge', knowledgeRouter);
app.use('/v1/approvals', approvalsRouter);
app.use('/v1/evals', evalsRouter);
app.use('/v1/audit-logs', auditRouter);
app.use('/v1/integrations', integrationsRouter);

// Global error handler
app.use(errorHandler);

// Initialize RabbitMQ connection asynchronously
rabbitMQClient.connect().catch((err) => {
  logger.warn('RabbitMQ background init notice', { err: err.message });
});

export const server = app.listen(port, () => {
  logger.info(`Zeemo API server listening on http://localhost:${port}`);
});

export default app;
