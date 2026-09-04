import { z } from 'zod';

// ==========================================
// Workspace & User Schemas
// ==========================================
export const WorkspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
export type Workspace = z.infer<typeof WorkspaceSchema>;

export const UserRoleSchema = z.enum(['owner', 'admin', 'member', 'viewer']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  avatarUrl: z.string().url().optional().nullable(),
  createdAt: z.string().datetime().optional(),
});
export type User = z.infer<typeof UserSchema>;

export const MembershipSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  userId: z.string().uuid(),
  role: UserRoleSchema,
  createdAt: z.string().datetime().optional(),
});
export type Membership = z.infer<typeof MembershipSchema>;

// ==========================================
// Incident Schemas
// ==========================================
export const IncidentSeveritySchema = z.enum(['low', 'medium', 'high', 'critical']);
export type IncidentSeverity = z.infer<typeof IncidentSeveritySchema>;

export const IncidentStatusSchema = z.enum([
  'open',
  'investigating',
  'waiting_approval',
  'remediated',
  'resolved',
  'closed',
]);
export type IncidentStatus = z.infer<typeof IncidentStatusSchema>;

export const CreateIncidentSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(5),
  service: z.string().min(1).max(100),
  environment: z.string().min(1).max(50).default('production'),
  severity: IncidentSeveritySchema.default('high'),
  additionalContext: z.string().optional().nullable(),
});
export type CreateIncidentInput = z.infer<typeof CreateIncidentSchema>;

export const IncidentSchema = CreateIncidentSchema.extend({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  status: IncidentStatusSchema.default('open'),
  rootCause: z.string().optional().nullable(),
  confidence: z.number().min(0).max(1).optional().nullable(),
  activeRunId: z.string().uuid().optional().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Incident = z.infer<typeof IncidentSchema>;

// ==========================================
// Agent Run & Tracing Schemas
// ==========================================
export const RunStatusSchema = z.enum([
  'queued',
  'planning',
  'investigating',
  'verifying',
  'waiting_for_approval',
  'executing',
  'completed',
  'failed',
  'cancelled',
]);
export type RunStatus = z.infer<typeof RunStatusSchema>;

export const AgentNameSchema = z.enum([
  'orchestrator',
  'knowledge',
  'code',
  'log',
  'verifier',
]);
export type AgentName = z.infer<typeof AgentNameSchema>;

export const AgentStepSchema = z.object({
  id: z.string().uuid(),
  runId: z.string().uuid(),
  agentName: AgentNameSchema,
  stepType: z.string(),
  title: z.string(),
  input: z.unknown().optional(),
  output: z.unknown().optional(),
  status: z.enum(['pending', 'running', 'completed', 'failed']),
  latencyMs: z.number().int().nonnegative().optional(),
  createdAt: z.string().datetime(),
});
export type AgentStep = z.infer<typeof AgentStepSchema>;

export const RiskLevelSchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

export const ToolCallSchema = z.object({
  id: z.string().uuid(),
  runId: z.string().uuid(),
  toolName: z.string(),
  arguments: z.record(z.unknown()),
  result: z.unknown().optional(),
  riskLevel: RiskLevelSchema.default('LOW'),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'approval_required', 'rejected']),
  latencyMs: z.number().int().nonnegative().optional(),
  createdAt: z.string().datetime(),
});
export type ToolCall = z.infer<typeof ToolCallSchema>;

export const AgentRunSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  incidentId: z.string().uuid(),
  status: RunStatusSchema,
  model: z.string().default('gemini-3.8-flash'),
  inputTokens: z.number().int().nonnegative().default(0),
  outputTokens: z.number().int().nonnegative().default(0),
  estimatedCost: z.number().nonnegative().default(0),
  startedAt: z.string().datetime().optional().nullable(),
  completedAt: z.string().datetime().optional().nullable(),
  error: z.string().optional().nullable(),
});
export type AgentRun = z.infer<typeof AgentRunSchema>;

// ==========================================
// Evidence & Diagnosis Schemas
// ==========================================
export const EvidenceSourceTypeSchema = z.enum([
  'log',
  'code',
  'doc',
  'deployment',
  'metric',
]);
export type EvidenceSourceType = z.infer<typeof EvidenceSourceTypeSchema>;

export const EvidenceSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  incidentId: z.string().uuid(),
  runId: z.string().uuid(),
  sourceType: EvidenceSourceTypeSchema,
  sourceId: z.string(),
  location: z.string(),
  title: z.string(),
  excerpt: z.string(),
  relevanceScore: z.number().min(0).max(1),
  createdAt: z.string().datetime(),
});
export type Evidence = z.infer<typeof EvidenceSchema>;

export const RemediationActionSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  description: z.string(),
  riskLevel: RiskLevelSchema,
  toolName: z.string().optional(),
  arguments: z.record(z.unknown()).optional(),
  requiresApproval: z.boolean(),
  status: z.enum(['suggested', 'pending_approval', 'approved', 'executed', 'rejected']).default('suggested'),
});
export type RemediationAction = z.infer<typeof RemediationActionSchema>;

export const DiagnosisReportSchema = z.object({
  incidentId: z.string().uuid(),
  rootCause: z.string(),
  confidence: z.number().min(0).max(1),
  impact: z.string(),
  timeline: z.array(
    z.object({
      timestamp: z.string(),
      description: z.string(),
    })
  ),
  supportingEvidenceIds: z.array(z.string().uuid()),
  alternativeHypotheses: z.array(
    z.object({
      hypothesis: z.string(),
      rejectionReason: z.string(),
    })
  ),
  remediationPlan: z.array(RemediationActionSchema),
});
export type DiagnosisReport = z.infer<typeof DiagnosisReportSchema>;

// ==========================================
// Human Approval Schemas
// ==========================================
export const ApprovalStatusSchema = z.enum(['pending', 'approved', 'rejected']);
export type ApprovalStatus = z.infer<typeof ApprovalStatusSchema>;

export const ApprovalSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  runId: z.string().uuid(),
  toolCallId: z.string().uuid(),
  action: z.string(),
  riskLevel: RiskLevelSchema,
  arguments: z.record(z.unknown()),
  reason: z.string(),
  status: ApprovalStatusSchema.default('pending'),
  requestedAt: z.string().datetime(),
  decidedAt: z.string().datetime().optional().nullable(),
  decidedBy: z.string().optional().nullable(),
});
export type Approval = z.infer<typeof ApprovalSchema>;

// ==========================================
// Knowledge & Document Schemas
// ==========================================
export const DocumentTypeSchema = z.enum([
  'runbook',
  'postmortem',
  'architecture',
  'api_doc',
  'guide',
  'readme',
]);
export type DocumentType = z.infer<typeof DocumentTypeSchema>;

export const DocumentStatusSchema = z.enum([
  'uploaded',
  'processing',
  'indexed',
  'failed',
]);
export type DocumentStatus = z.infer<typeof DocumentStatusSchema>;

export const KnowledgeDocumentSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  name: z.string(),
  source: z.string(),
  documentType: DocumentTypeSchema,
  service: z.string().optional().nullable(),
  environment: z.string().optional().nullable(),
  status: DocumentStatusSchema.default('uploaded'),
  chunkCount: z.number().int().nonnegative().default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type KnowledgeDocument = z.infer<typeof KnowledgeDocumentSchema>;

export const DocumentChunkSchema = z.object({
  id: z.string().uuid(),
  documentId: z.string().uuid(),
  chunkIndex: z.number().int().nonnegative(),
  content: z.string(),
  metadata: z.record(z.unknown()),
  createdAt: z.string().datetime(),
});
export type DocumentChunk = z.infer<typeof DocumentChunkSchema>;

// ==========================================
// Audit Log Schemas
// ==========================================
export const AuditLogSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  userId: z.string().uuid().optional().nullable(),
  action: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.string().datetime(),
});
export type AuditLog = z.infer<typeof AuditLogSchema>;

// ==========================================
// AI Evaluation Benchmark Schemas
// ==========================================
export const EvaluationCaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  service: z.string(),
  severity: IncidentSeveritySchema,
  description: z.string(),
  expectedRootCause: z.string(),
  expectedEvidence: z.array(z.string()),
  expectedRemediation: z.string(),
});
export type EvaluationCase = z.infer<typeof EvaluationCaseSchema>;

export const EvaluationMetricsSchema = z.object({
  rootCauseAccuracy: z.number().min(0).max(100),
  evidencePrecision: z.number().min(0).max(100),
  citationAccuracy: z.number().min(0).max(100),
  toolSelectionAccuracy: z.number().min(0).max(100),
  taskCompletionRate: z.number().min(0).max(100),
  hallucinationRate: z.number().min(0).max(100),
  p50LatencySeconds: z.number().nonnegative(),
  p95LatencySeconds: z.number().nonnegative(),
  averageCostUsd: z.number().nonnegative(),
  totalEvaluatedCases: z.number().int().nonnegative(),
});
export type EvaluationMetrics = z.infer<typeof EvaluationMetricsSchema>;
