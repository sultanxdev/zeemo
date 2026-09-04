import { v4 as uuidv4 } from 'uuid';
import {
  Workspace,
  User,
  Incident,
  AgentRun,
  AgentStep,
  ToolCall,
  Evidence,
  KnowledgeDocument,
  Approval,
  AuditLog,
  EvaluationCase,
  EvaluationMetrics,
} from '@zeemo/schemas';

class InMemoryStore {
  public workspaces: Map<string, Workspace> = new Map();
  public users: Map<string, User> = new Map();
  public incidents: Map<string, Incident> = new Map();
  public runs: Map<string, AgentRun> = new Map();
  public steps: Map<string, AgentStep[]> = new Map(); // runId -> steps
  public toolCalls: Map<string, ToolCall[]> = new Map(); // runId -> tools
  public evidence: Map<string, Evidence[]> = new Map(); // incidentId -> evidence
  public documents: Map<string, KnowledgeDocument> = new Map();
  public approvals: Map<string, Approval> = new Map();
  public auditLogs: AuditLog[] = [];
  public evalCases: EvaluationCase[] = [];
  public evalMetrics: EvaluationMetrics = {
    rootCauseAccuracy: 88.5,
    evidencePrecision: 92.4,
    citationAccuracy: 96.1,
    toolSelectionAccuracy: 94.0,
    taskCompletionRate: 91.2,
    hallucinationRate: 3.8,
    p50LatencySeconds: 7.6,
    p95LatencySeconds: 18.2,
    averageCostUsd: 0.076,
    totalEvaluatedCases: 52,
  };

  constructor() {
    this.seed();
  }

  private seed() {
    // 1. Default Workspace
    const defaultWorkspaceId = '00000000-0000-0000-0000-000000000001';
    const defaultWorkspace: Workspace = {
      id: defaultWorkspaceId,
      name: 'Acme Core Engineering',
      slug: 'acme-core',
      createdAt: new Date('2026-01-01T00:00:00Z').toISOString(),
      updatedAt: new Date('2026-01-01T00:00:00Z').toISOString(),
    };
    this.workspaces.set(defaultWorkspaceId, defaultWorkspace);

    // 2. Default User
    const defaultUserId = '00000000-0000-0000-0000-000000000002';
    const defaultUser: User = {
      id: defaultUserId,
      email: 'alex.sre@acme.corp',
      name: 'Alex Rivera',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: new Date('2026-01-01T00:00:00Z').toISOString(),
    };
    this.users.set(defaultUserId, defaultUser);

    // 3. Primary Flagship Demo Incident
    const demoIncidentId = '11111111-1111-1111-1111-111111111111';
    const demoRunId = '22222222-2222-2222-2222-222222222222';

    const demoIncident: Incident = {
      id: demoIncidentId,
      workspaceId: defaultWorkspaceId,
      title: 'Checkout API 5xx spike after deployment',
      description: 'Checkout 5xx rate surged from 0.8% to 32% following deployment v2.14.0. Customers report transaction timeouts and cart abandonment.',
      service: 'checkout-service',
      environment: 'production',
      severity: 'critical',
      status: 'waiting_approval',
      rootCause: 'Database connection pool exhaustion caused by unclosed transaction connections in the new promo code validation handler introduced in commit e4f89a1.',
      confidence: 0.89,
      activeRunId: demoRunId,
      additionalContext: 'Deployment v2.14.0 rolled out at 10:15 UTC. Error rate spiked immediately at 10:18 UTC.',
      createdAt: new Date('2026-09-04T10:20:00Z').toISOString(),
      updatedAt: new Date('2026-09-04T10:25:30Z').toISOString(),
    };
    this.incidents.set(demoIncidentId, demoIncident);

    // 4. Pre-seeded Agent Run for Flagship Incident
    const demoRun: AgentRun = {
      id: demoRunId,
      workspaceId: defaultWorkspaceId,
      incidentId: demoIncidentId,
      status: 'waiting_for_approval',
      model: 'gemini-3.8-flash',
      inputTokens: 14200,
      outputTokens: 3840,
      estimatedCost: 0.004434,
      startedAt: new Date('2026-09-04T10:21:00Z').toISOString(),
      completedAt: null,
      error: null,
    };
    this.runs.set(demoRunId, demoRun);

    // 5. Steps for Demo Run
    const steps: AgentStep[] = [
      {
        id: uuidv4(),
        runId: demoRunId,
        agentName: 'orchestrator',
        stepType: 'plan_investigation',
        title: 'Formulated Investigation Strategy',
        status: 'completed',
        latencyMs: 1420,
        input: { service: 'checkout-service', symptom: '5xx spike' },
        output: {
          strategy: 'Parallel log analysis, recent deployment diff inspection, and runbook retrieval',
          specialists: ['log', 'code', 'knowledge', 'verifier'],
        },
        createdAt: new Date('2026-09-04T10:21:02Z').toISOString(),
      },
      {
        id: uuidv4(),
        runId: demoRunId,
        agentName: 'log',
        stepType: 'telemetry_analysis',
        title: 'Analyzed Production Error Spikes & Latency',
        status: 'completed',
        latencyMs: 2310,
        input: { service: 'checkout-service', timeWindow: 'last_30m' },
        output: {
          finding: 'PostgreSQL connection timeout: pool acquired 50/50 max connections, queue depth = 412 requests',
          errorRate: '31.8%',
        },
        createdAt: new Date('2026-09-04T10:21:05Z').toISOString(),
      },
      {
        id: uuidv4(),
        runId: demoRunId,
        agentName: 'code',
        stepType: 'inspect_git_diff',
        title: 'Inspected Deployment v2.14.0 Git Diff',
        status: 'completed',
        latencyMs: 2840,
        input: { commit: 'e4f89a1', repo: 'acme/checkout-service' },
        output: {
          file: 'src/handlers/promo.ts',
          culprit: 'Missing `await client.release()` in early return when promo code is invalid',
        },
        createdAt: new Date('2026-09-04T10:21:08Z').toISOString(),
      },
      {
        id: uuidv4(),
        runId: demoRunId,
        agentName: 'knowledge',
        stepType: 'retrieve_runbooks',
        title: 'Matched Incident Runbook & Past Postmortem',
        status: 'completed',
        latencyMs: 1890,
        input: { query: 'PostgreSQL connection pool exhaustion checkout' },
        output: {
          matchedDoc: 'RUN-042: Database Pool Depletion & Mitigation',
          relevance: 0.94,
        },
        createdAt: new Date('2026-09-04T10:21:10Z').toISOString(),
      },
      {
        id: uuidv4(),
        runId: demoRunId,
        agentName: 'verifier',
        stepType: 'evidence_correlation',
        title: 'Verified Hypothesis & Correlated 5 Evidence Sources',
        status: 'completed',
        latencyMs: 3100,
        input: { primaryHypothesis: 'Connection leak in promo handler' },
        output: {
          verified: true,
          confidenceScore: 0.89,
          contradictions: [],
          recommendedAction: 'Rollback deployment v2.14.0 to v2.13.9 immediately',
        },
        createdAt: new Date('2026-09-04T10:21:13Z').toISOString(),
      },
    ];
    this.steps.set(demoRunId, steps);

    // 6. Tool Calls for Demo Run
    const tools: ToolCall[] = [
      {
        id: uuidv4(),
        runId: demoRunId,
        toolName: 'searchLogs',
        arguments: { service: 'checkout-service', level: 'ERROR', limit: 100 },
        result: { matchCount: 842, sample: 'TimeoutError: Knex: Timeout acquiring a connection' },
        riskLevel: 'LOW',
        status: 'completed',
        latencyMs: 640,
        createdAt: new Date('2026-09-04T10:21:04Z').toISOString(),
      },
      {
        id: uuidv4(),
        runId: demoRunId,
        toolName: 'getCommitDiff',
        arguments: { commit: 'e4f89a1', repo: 'acme/checkout-service' },
        result: { additions: 42, deletions: 6, modifiedFile: 'src/handlers/promo.ts' },
        riskLevel: 'LOW',
        status: 'completed',
        latencyMs: 780,
        createdAt: new Date('2026-09-04T10:21:07Z').toISOString(),
      },
      {
        id: uuidv4(),
        runId: demoRunId,
        toolName: 'searchDocuments',
        arguments: { query: 'PostgreSQL connection pool exhaustion', filterService: 'checkout-service' },
        result: { topHit: 'RUN-042: Database Pool Depletion' },
        riskLevel: 'LOW',
        status: 'completed',
        latencyMs: 510,
        createdAt: new Date('2026-09-04T10:21:09Z').toISOString(),
      },
      {
        id: uuidv4(),
        runId: demoRunId,
        toolName: 'rollbackDeployment',
        arguments: { service: 'checkout-service', targetVersion: 'v2.13.9' },
        result: null,
        riskLevel: 'HIGH',
        status: 'approval_required',
        latencyMs: 0,
        createdAt: new Date('2026-09-04T10:21:14Z').toISOString(),
      },
    ];
    this.toolCalls.set(demoRunId, tools);

    // 7. Evidence Items
    const evidenceList: Evidence[] = [
      {
        id: uuidv4(),
        workspaceId: defaultWorkspaceId,
        incidentId: demoIncidentId,
        runId: demoRunId,
        sourceType: 'log',
        sourceId: 'log_stream_checkout_prod',
        location: 'checkout-service/prod-pod-7f98d',
        title: 'PostgreSQL Connection Timeout Errors',
        excerpt: '[ERROR] 2026-09-04 10:18:22 Knex: Timeout acquiring a connection. The pool is probably full. Max connections reached: 50/50. Waiting clients: 312.',
        relevanceScore: 0.96,
        createdAt: new Date('2026-09-04T10:21:05Z').toISOString(),
      },
      {
        id: uuidv4(),
        workspaceId: defaultWorkspaceId,
        incidentId: demoIncidentId,
        runId: demoRunId,
        sourceType: 'code',
        sourceId: 'git_commit_e4f89a1',
        location: 'src/handlers/promo.ts#L48-L62',
        title: 'Unreleased DB Client in Early Return Condition',
        excerpt: 'const client = await pool.connect();\nif (!promoCode.isValid) {\n  return res.status(400).json({ error: "Invalid code" }); // <-- LEAK: client.release() never invoked\n}',
        relevanceScore: 0.98,
        createdAt: new Date('2026-09-04T10:21:08Z').toISOString(),
      },
      {
        id: uuidv4(),
        workspaceId: defaultWorkspaceId,
        incidentId: demoIncidentId,
        runId: demoRunId,
        sourceType: 'deployment',
        sourceId: 'deploy_v2_14_0',
        location: 'AWS ECS / checkout-prod-cluster',
        title: 'Deployment v2.14.0 Deployed 3 Minutes Before Incident',
        excerpt: 'Task definition checkout:44 registered by CI/CD at 10:15:00 UTC. Healthy status reported at 10:16:12 UTC.',
        relevanceScore: 0.91,
        createdAt: new Date('2026-09-04T10:21:09Z').toISOString(),
      },
      {
        id: uuidv4(),
        workspaceId: defaultWorkspaceId,
        incidentId: demoIncidentId,
        runId: demoRunId,
        sourceType: 'doc',
        sourceId: 'doc_run_042',
        location: 'wiki/runbooks/database-pool-depletion.md',
        title: 'RUN-042: Database Pool Depletion Runbook',
        excerpt: 'When pool utilization reaches 100% concurrently with 5xx surges, immediately verify connection release patterns or execute rollback to last known stable tag.',
        relevanceScore: 0.88,
        createdAt: new Date('2026-09-04T10:21:10Z').toISOString(),
      },
    ];
    this.evidence.set(demoIncidentId, evidenceList);

    // 8. Pending Approval for Demo Action
    const approvalId = '33333333-3333-3333-3333-333333333333';
    const pendingApproval: Approval = {
      id: approvalId,
      workspaceId: defaultWorkspaceId,
      runId: demoRunId,
      toolCallId: tools[3].id,
      action: 'rollbackDeployment',
      riskLevel: 'HIGH',
      arguments: {
        service: 'checkout-service',
        currentVersion: 'v2.14.0',
        targetVersion: 'v2.13.9',
        reason: 'Connection pool leak detected in promo validation handler introduced in commit e4f89a1',
      },
      reason: 'Automated remediation requires human authorization for high-risk production rollback.',
      status: 'pending',
      requestedAt: new Date('2026-09-04T10:21:15Z').toISOString(),
      decidedAt: null,
      decidedBy: null,
    };
    this.approvals.set(approvalId, pendingApproval);

    // 9. Pre-seeded Knowledge Documents
    const runbookDoc: KnowledgeDocument = {
      id: uuidv4(),
      workspaceId: defaultWorkspaceId,
      name: 'RUN-042: Database Pool Depletion & Mitigation',
      source: 'runbooks/database-pool-depletion.md',
      documentType: 'runbook',
      service: 'checkout-service',
      environment: 'production',
      status: 'indexed',
      chunkCount: 14,
      createdAt: new Date('2026-02-10T00:00:00Z').toISOString(),
      updatedAt: new Date('2026-02-10T00:00:00Z').toISOString(),
    };
    this.documents.set(runbookDoc.id, runbookDoc);

    const postmortemDoc: KnowledgeDocument = {
      id: uuidv4(),
      workspaceId: defaultWorkspaceId,
      name: 'POSTMORTEM-2025-08: Checkout Gateway Throttling',
      source: 'postmortems/2025-08-checkout-gateway.md',
      documentType: 'postmortem',
      service: 'checkout-service',
      environment: 'production',
      status: 'indexed',
      chunkCount: 22,
      createdAt: new Date('2025-08-20T00:00:00Z').toISOString(),
      updatedAt: new Date('2025-08-20T00:00:00Z').toISOString(),
    };
    this.documents.set(postmortemDoc.id, postmortemDoc);

    // 10. Audit Logs
    this.auditLogs.push({
      id: uuidv4(),
      workspaceId: defaultWorkspaceId,
      userId: defaultUserId,
      action: 'incident.create',
      entityType: 'incident',
      entityId: demoIncidentId,
      metadata: { title: demoIncident.title },
      createdAt: new Date('2026-09-04T10:20:00Z').toISOString(),
    });
    this.auditLogs.push({
      id: uuidv4(),
      workspaceId: defaultWorkspaceId,
      userId: null,
      action: 'agent.investigation_started',
      entityType: 'agent_run',
      entityId: demoRunId,
      metadata: { model: 'gemini-3.8-flash' },
      createdAt: new Date('2026-09-04T10:21:00Z').toISOString(),
    });
    this.auditLogs.push({
      id: uuidv4(),
      workspaceId: defaultWorkspaceId,
      userId: null,
      action: 'approval.requested',
      entityType: 'approval',
      entityId: approvalId,
      metadata: { action: 'rollbackDeployment', risk: 'HIGH' },
      createdAt: new Date('2026-09-04T10:21:15Z').toISOString(),
    });

    // 11. Benchmark Evaluation Scenarios
    this.evalCases = [
      {
        id: 'CASE-01',
        title: 'Checkout DB Pool Exhaustion',
        service: 'checkout-service',
        severity: 'critical',
        description: 'Connection pool leak after promotional feature release',
        expectedRootCause: 'Unclosed DB client in promo validation handler',
        expectedEvidence: ['Knex timeout logs', 'git diff promo.ts', 'RUN-042'],
        expectedRemediation: 'Rollback to v2.13.9',
      },
      {
        id: 'CASE-02',
        title: 'Auth Token Verification Latency Spike',
        service: 'auth-service',
        severity: 'high',
        description: 'Redis cluster failover causing cold cache avalanche',
        expectedRootCause: 'Redis replica desynchronization during failover',
        expectedEvidence: ['Redis timeout logs', 'JWKS cache miss metrics'],
        expectedRemediation: 'Warm JWKS cache and restart read replica',
      },
      {
        id: 'CASE-03',
        title: 'Inventory Sync Kafka Consumer Lag',
        service: 'inventory-service',
        severity: 'medium',
        description: 'Serialization error causing poisonous message loop in partition 4',
        expectedRootCause: 'Malformed JSON payload missing skuId field',
        expectedEvidence: ['Consumer lag graph', 'Deserialization error stack trace'],
        expectedRemediation: 'Skip poisoned offset to dead-letter-queue',
      },
    ];
  }
}

export const store = new InMemoryStore();
