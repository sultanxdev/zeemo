import { Router, Request, Response } from 'express';
import { store } from '../lib/store.js';
import { successResponse } from '@zeemo/shared';

export const evalsRouter = Router();

// GET /v1/evals
evalsRouter.get('/', (_req: Request, res: Response) => {
  res.json(
    successResponse({
      metrics: store.evalMetrics,
      cases: store.evalCases,
    })
  );
});

// POST /v1/evals/run
evalsRouter.post('/run', (_req: Request, res: Response) => {
  // Simulate updated evaluation test run
  store.evalMetrics = {
    ...store.evalMetrics,
    rootCauseAccuracy: Number((87.5 + Math.random() * 2).toFixed(1)),
    evidencePrecision: Number((91.5 + Math.random() * 2).toFixed(1)),
    p50LatencySeconds: Number((7.2 + Math.random() * 0.8).toFixed(1)),
    totalEvaluatedCases: store.evalMetrics.totalEvaluatedCases + 1,
  };

  res.json(successResponse({ status: 'completed', metrics: store.evalMetrics }));
});
