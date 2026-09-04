import { Router, Request, Response } from 'express';
import { successResponse } from '@zeemo/shared';

export const integrationsRouter = Router();

const integrationsState = [
  {
    id: 'int_github',
    name: 'GitHub',
    type: 'vcs',
    status: 'connected',
    repository: 'acme/checkout-service',
    lastSync: '2026-09-04T10:15:00Z',
  },
  {
    id: 'int_observability',
    name: 'JSON Telemetry & Logs',
    type: 'logging',
    status: 'connected',
    service: 'checkout-service',
    lastSync: '2026-09-04T10:20:00Z',
  },
  {
    id: 'int_aws',
    name: 'AWS CloudWatch & ECS',
    type: 'cloud',
    status: 'connected',
    region: 'us-east-1',
    lastSync: '2026-09-04T10:16:00Z',
  },
];

// GET /v1/integrations
integrationsRouter.get('/', (_req: Request, res: Response) => {
  res.json(successResponse(integrationsState));
});

// POST /v1/integrations/:id/test
integrationsRouter.post('/:id/test', (req: Request, res: Response) => {
  const id = String(req.params.id);
  res.json(successResponse({ integrationId: id, pingStatus: 'healthy', latencyMs: 42 }));
});
