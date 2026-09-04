import { Router, Request, Response } from 'express';
import { store } from '../lib/store.js';
import { successResponse } from '@zeemo/shared';

export const auditRouter = Router();

// GET /v1/audit-logs
auditRouter.get('/', (req: Request, res: Response) => {
  const logs = store.auditLogs.filter((l) => l.workspaceId === req.workspaceId);
  res.json(successResponse(logs));
});
