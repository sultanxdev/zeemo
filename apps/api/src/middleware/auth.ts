import { Request, Response, NextFunction } from 'express';
import { store } from '../lib/store.js';
import { errorResponse } from '@zeemo/shared';

// Augment Express Request type
declare global {
  namespace Express {
    interface Request {
      workspaceId: string;
      userId: string;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Allow health check and public routes to bypass
  if (req.path === '/health' || req.path.startsWith('/v1/auth/')) {
    return next();
  }

  // 1. Resolve workspace from header or default
  const requestedWorkspaceId = req.headers['x-workspace-id'] as string;
  let workspaceId = '00000000-0000-0000-0000-000000000001';

  if (requestedWorkspaceId && store.workspaces.has(requestedWorkspaceId)) {
    workspaceId = requestedWorkspaceId;
  }

  // 2. Resolve user
  const userId = '00000000-0000-0000-0000-000000000002';

  req.workspaceId = workspaceId;
  req.userId = userId;
  next();
}
