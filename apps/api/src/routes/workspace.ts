import { Router, Request, Response } from 'express';
import { store } from '../lib/store.js';
import { successResponse, errorResponse } from '@zeemo/shared';
import { WorkspaceSchema } from '@zeemo/schemas';
import { v4 as uuidv4 } from 'uuid';

export const workspaceRouter = Router();

// GET /v1/workspaces - List all workspaces
workspaceRouter.get('/', (_req: Request, res: Response) => {
  const list = Array.from(store.workspaces.values());
  res.json(successResponse(list));
});

// GET /v1/workspaces/current - Get active workspace
workspaceRouter.get('/current', (req: Request, res: Response) => {
  const ws = store.workspaces.get(req.workspaceId);
  if (!ws) {
    res.status(404).json(errorResponse('Workspace not found', 'NOT_FOUND'));
    return;
  }
  res.json(successResponse(ws));
});

// POST /v1/workspaces - Create workspace
workspaceRouter.post('/', (req: Request, res: Response) => {
  const { name, slug } = req.body;
  if (!name || !slug) {
    res.status(400).json(errorResponse('Name and slug are required', 'BAD_REQUEST'));
    return;
  }

  const newWorkspace = WorkspaceSchema.parse({
    id: uuidv4(),
    name,
    slug,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  store.workspaces.set(newWorkspace.id, newWorkspace);
  res.status(201).json(successResponse(newWorkspace));
});
