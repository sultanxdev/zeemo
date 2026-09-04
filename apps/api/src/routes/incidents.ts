import { Router, Request, Response } from 'express';
import { store } from '../lib/store.js';
import { rabbitMQClient } from '../lib/rabbitmq.js';
import { successResponse, errorResponse, logger } from '@zeemo/shared';
import { CreateIncidentSchema, Incident, AgentRun } from '@zeemo/schemas';
import { v4 as uuidv4 } from 'uuid';

export const incidentsRouter = Router();

// GET /v1/incidents
incidentsRouter.get('/', (req: Request, res: Response) => {
  const { status, severity, service } = req.query;

  let list = Array.from(store.incidents.values()).filter(
    (inc) => inc.workspaceId === req.workspaceId
  );

  if (status && typeof status === 'string') {
    list = list.filter((inc) => inc.status === status);
  }
  if (severity && typeof severity === 'string') {
    list = list.filter((inc) => inc.severity === severity);
  }
  if (service && typeof service === 'string') {
    list = list.filter((inc) => inc.service.toLowerCase().includes(service.toLowerCase()));
  }

  // Sort newest first
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(successResponse(list));
});

// GET /v1/incidents/:id
incidentsRouter.get('/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const incident = store.incidents.get(id);
  if (!incident || incident.workspaceId !== req.workspaceId) {
    res.status(404).json(errorResponse('Incident not found', 'NOT_FOUND'));
    return;
  }

  const evidence = store.evidence.get(incident.id) || [];
  const activeRun = incident.activeRunId ? store.runs.get(incident.activeRunId) : null;
  const pendingApprovals = Array.from(store.approvals.values()).filter(
    (a) => a.workspaceId === req.workspaceId && a.runId === incident.activeRunId && a.status === 'pending'
  );

  res.json(
    successResponse({
      ...incident,
      evidence,
      activeRun,
      pendingApprovals,
    })
  );
});

// POST /v1/incidents
incidentsRouter.post('/', (req: Request, res: Response) => {
  const parsed = CreateIncidentSchema.parse(req.body);

  const incidentId = uuidv4();
  const now = new Date().toISOString();

  const newIncident: Incident = {
    ...parsed,
    id: incidentId,
    workspaceId: req.workspaceId,
    status: 'open',
    rootCause: null,
    confidence: null,
    activeRunId: null,
    createdAt: now,
    updatedAt: now,
  };

  store.incidents.set(incidentId, newIncident);

  store.auditLogs.unshift({
    id: uuidv4(),
    workspaceId: req.workspaceId,
    userId: req.userId,
    action: 'incident.create',
    entityType: 'incident',
    entityId: incidentId,
    metadata: { title: newIncident.title, service: newIncident.service },
    createdAt: now,
  });

  logger.info('Created new incident', { incidentId, title: newIncident.title });
  res.status(201).json(successResponse(newIncident));
});

// PATCH /v1/incidents/:id
incidentsRouter.patch('/:id', (req: Request, res: Response) => {
  const incident = store.incidents.get(req.params.id);
  if (!incident || incident.workspaceId !== req.workspaceId) {
    res.status(404).json(errorResponse('Incident not found', 'NOT_FOUND'));
    return;
  }

  const allowedUpdates = ['status', 'severity', 'rootCause', 'confidence'];
  for (const key of allowedUpdates) {
    if (key in req.body) {
      (incident as any)[key] = req.body[key];
    }
  }
  incident.updatedAt = new Date().toISOString();
  store.incidents.set(incident.id, incident);

  res.json(successResponse(incident));
});

// POST /v1/incidents/:id/investigate - Trigger an AI Investigation Run
incidentsRouter.post('/:id/investigate', async (req: Request, res: Response) => {
  const incident = store.incidents.get(req.params.id);
  if (!incident || incident.workspaceId !== req.workspaceId) {
    res.status(404).json(errorResponse('Incident not found', 'NOT_FOUND'));
    return;
  }

  const runId = uuidv4();
  const now = new Date().toISOString();

  const run: AgentRun = {
    id: runId,
    workspaceId: req.workspaceId,
    incidentId: incident.id,
    status: 'queued',
    model: 'gemini-3.8-flash',
    inputTokens: 0,
    outputTokens: 0,
    estimatedCost: 0,
    startedAt: now,
    completedAt: null,
    error: null,
  };

  store.runs.set(runId, run);
  incident.status = 'investigating';
  incident.activeRunId = runId;
  incident.updatedAt = now;
  store.incidents.set(incident.id, incident);

  // Publish to RabbitMQ
  await rabbitMQClient.publishInvestigation({
    incidentId: incident.id,
    workspaceId: req.workspaceId,
    runId,
  });

  logger.info('Queued investigation run', { runId, incidentId: incident.id });
  res.status(202).json(successResponse({ runId, status: 'queued' }));
});
