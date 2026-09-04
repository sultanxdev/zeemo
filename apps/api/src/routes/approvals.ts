import { Router, Request, Response } from 'express';
import { store } from '../lib/store.js';
import { successResponse, errorResponse, logger } from '@zeemo/shared';
import { v4 as uuidv4 } from 'uuid';

export const approvalsRouter = Router();

// GET /v1/approvals
approvalsRouter.get('/', (req: Request, res: Response) => {
  const list = Array.from(store.approvals.values()).filter(
    (app) => app.workspaceId === req.workspaceId
  );
  list.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  res.json(successResponse(list));
});

// GET /v1/approvals/:id
approvalsRouter.get('/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const approval = store.approvals.get(id);
  if (!approval || approval.workspaceId !== req.workspaceId) {
    res.status(404).json(errorResponse('Approval request not found', 'NOT_FOUND'));
    return;
  }
  res.json(successResponse(approval));
});

// POST /v1/approvals/:id/approve
approvalsRouter.post('/:id/approve', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const approval = store.approvals.get(id);
  if (!approval || approval.workspaceId !== req.workspaceId) {
    res.status(404).json(errorResponse('Approval request not found', 'NOT_FOUND'));
    return;
  }

  if (approval.status !== 'pending') {
    res.status(400).json(errorResponse(`Action already ${approval.status}`, 'INVALID_STATE'));
    return;
  }

  const now = new Date().toISOString();
  approval.status = 'approved';
  approval.decidedAt = now;
  approval.decidedBy = req.userId;
  store.approvals.set(approval.id, approval);

  // Update associated tool call status
  const tools = store.toolCalls.get(approval.runId) || [];
  const targetTool = tools.find((t) => t.id === approval.toolCallId);
  if (targetTool) {
    targetTool.status = 'completed';
    targetTool.result = {
      executionStatus: 'success',
      actionExecuted: approval.action,
      rollbackTarget: approval.arguments.targetVersion || 'v2.13.9',
      verifiedHealthyInstances: '12/12',
      errorRateObserved: '0.04% (normal)',
    };
  }

  // Update run status
  const run = store.runs.get(approval.runId);
  if (run) {
    run.status = 'completed';
    run.completedAt = now;
    store.runs.set(run.id, run);

    // Update incident status
    const incident = store.incidents.get(run.incidentId);
    if (incident) {
      incident.status = 'resolved';
      incident.updatedAt = now;
      store.incidents.set(incident.id, incident);
    }
  }

  // Audit log entry
  store.auditLogs.unshift({
    id: uuidv4(),
    workspaceId: req.workspaceId,
    userId: req.userId,
    action: 'approval.approved',
    entityType: 'approval',
    entityId: approval.id,
    metadata: {
      action: approval.action,
      toolCallId: approval.toolCallId,
    },
    createdAt: now,
  });

  logger.info('Approved high-risk action', { approvalId: approval.id, action: approval.action });
  res.json(successResponse(approval));
});

// POST /v1/approvals/:id/reject
approvalsRouter.post('/:id/reject', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const approval = store.approvals.get(id);
  if (!approval || approval.workspaceId !== req.workspaceId) {
    res.status(404).json(errorResponse('Approval request not found', 'NOT_FOUND'));
    return;
  }

  const now = new Date().toISOString();
  approval.status = 'rejected';
  approval.decidedAt = now;
  approval.decidedBy = req.userId;
  store.approvals.set(approval.id, approval);

  // Update tool call status
  const tools = store.toolCalls.get(approval.runId) || [];
  const targetTool = tools.find((t) => t.id === approval.toolCallId);
  if (targetTool) {
    targetTool.status = 'rejected';
  }

  // Audit log entry
  store.auditLogs.unshift({
    id: uuidv4(),
    workspaceId: req.workspaceId,
    userId: req.userId,
    action: 'approval.rejected',
    entityType: 'approval',
    entityId: approval.id,
    metadata: { action: approval.action },
    createdAt: now,
  });

  logger.info('Rejected high-risk action', { approvalId: approval.id, action: approval.action });
  res.json(successResponse(approval));
});
