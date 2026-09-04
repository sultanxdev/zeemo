import { Router, Request, Response } from 'express';
import { store } from '../lib/store.js';
import { successResponse, errorResponse } from '@zeemo/shared';

export const runsRouter = Router();

// GET /v1/runs
runsRouter.get('/', (req: Request, res: Response) => {
  const list = Array.from(store.runs.values()).filter(
    (run) => run.workspaceId === req.workspaceId
  );
  res.json(successResponse(list));
});

// GET /v1/runs/:id
runsRouter.get('/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const run = store.runs.get(id);
  if (!run || run.workspaceId !== req.workspaceId) {
    res.status(404).json(errorResponse('Run not found', 'NOT_FOUND'));
    return;
  }
  res.json(successResponse(run));
});

// GET /v1/runs/:id/trace - Full execution trace
runsRouter.get('/:id/trace', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const run = store.runs.get(id);
  if (!run || run.workspaceId !== req.workspaceId) {
    res.status(404).json(errorResponse('Run not found', 'NOT_FOUND'));
    return;
  }

  const steps = store.steps.get(run.id) || [];
  const tools = store.toolCalls.get(run.id) || [];

  res.json(
    successResponse({
      run,
      steps,
      toolCalls: tools,
    })
  );
});
