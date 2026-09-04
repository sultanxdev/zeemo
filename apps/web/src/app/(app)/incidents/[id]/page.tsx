'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { fetchApi } from '@/lib/api';
import { formatTimestamp, formatCost } from '@/lib/utils';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Cpu,
  FileCode2,
  FileText,
  Layers,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Activity,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

export default function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const incidentId = resolvedParams.id;

  const [incident, setIncident] = useState<any>(null);
  const [trace, setTrace] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'evidence' | 'investigation' | 'trace' | 'remediation' | 'timeline'
  >('overview');
  const [actionLoading, setActionLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    Promise.all([
      fetchApi<any>(`/v1/incidents/${incidentId}`),
      fetchApi<any>('/v1/runs').then((runs) => {
        const targetRun = runs.find((r: any) => r.incidentId === incidentId);
        if (targetRun) {
          return fetchApi<any>(`/v1/runs/${targetRun.id}/trace`);
        }
        return null;
      }),
    ])
      .then(([incData, traceData]) => {
        setIncident(incData);
        setTrace(traceData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading incident detail', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [incidentId]);

  const handleApprove = async (approvalId: string) => {
    setActionLoading(true);
    try {
      await fetchApi(`/v1/approvals/${approvalId}/approve`, { method: 'POST' });
      loadData();
    } catch (err) {
      console.error('Approval failed', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (approvalId: string) => {
    setActionLoading(true);
    try {
      await fetchApi(`/v1/approvals/${approvalId}/reject`, { method: 'POST' });
      loadData();
    } catch (err) {
      console.error('Reject failed', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center font-mono text-muted-foreground text-xs">
        Loading investigation state...
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className="text-white text-sm">Incident not found.</p>
        <Link href="/incidents">
          <Button variant="outline" size="sm">
            Back to Incidents
          </Button>
        </Link>
      </div>
    );
  }

  const steps = trace?.steps || [];
  const toolCalls = trace?.toolCalls || [];
  const run = trace?.run || incident.activeRun;
  const pendingApprovals = incident.pendingApprovals || [];

  return (
    <div className="space-y-6">
      {/* Back button & top navigation */}
      <div className="flex items-center justify-between">
        <Link href="/incidents">
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Incidents
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-[10px]">
            RUN ID: {run ? run.id.slice(0, 8) : 'NONE'}
          </Badge>
          <Badge
            variant={
              incident.status === 'resolved'
                ? 'success'
                : incident.status === 'waiting_approval'
                ? 'high'
                : 'outline'
            }
          >
            {incident.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Incident Header Card (PRD Section 17) */}
      <Card className="bg-card/70 border-border shadow-lg overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    incident.severity === 'critical'
                      ? 'critical'
                      : incident.severity === 'high'
                      ? 'high'
                      : 'medium'
                  }
                >
                  {incident.severity.toUpperCase()}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">•</span>
                <span className="text-xs font-mono text-muted-foreground">{incident.environment}</span>
                <span className="text-xs font-mono text-muted-foreground">•</span>
                <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                  {incident.service}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                {incident.title}
              </h1>
              <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
                {incident.description}
              </p>
            </div>

            {/* Confidence & Quick Stats Pill */}
            <div className="flex md:flex-col items-end gap-2 shrink-0">
              <div className="p-3 rounded-lg border border-border bg-secondary/40 text-right">
                <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                  Diagnosis Confidence
                </span>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  {incident.confidence ? `${Math.round(incident.confidence * 100)}%` : '--'}
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {incident.evidence?.length || 0} Correlated Sources
                </span>
              </div>
            </div>
          </div>

          {/* Root Cause Banner if available */}
          {incident.rootCause && (
            <div className="p-4 rounded-lg border border-blue-500/30 bg-blue-950/20 text-xs">
              <div className="flex items-center gap-2 text-blue-400 font-semibold mb-1">
                <Cpu className="h-4 w-4" />
                <span>Primary Root Cause Diagnosis</span>
              </div>
              <p className="text-white font-medium leading-relaxed mt-1">
                {incident.rootCause}
              </p>
            </div>
          )}

          {/* Human Approval Alert Banner if pending */}
          {pendingApprovals.length > 0 && (
            <div className="p-4 rounded-lg border border-amber-500/40 bg-amber-950/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                  <ShieldAlert className="h-4 w-4" />
                  <span>ACTION AUTHORIZATION REQUIRED (RISK: HIGH)</span>
                </div>
                <Badge variant="high">HUMAN-IN-THE-LOOP</Badge>
              </div>

              {pendingApprovals.map((app: any) => (
                <div key={app.id} className="space-y-2">
                  <div className="text-xs text-white">
                    <span className="font-semibold text-amber-300">Action:</span> {app.action} (target:{' '}
                    <code className="font-mono bg-black/40 px-1.5 py-0.5 rounded text-amber-400">
                      {app.arguments?.targetVersion || 'v2.13.9'}
                    </code>
                    )
                  </div>
                  <p className="text-[11px] text-muted-foreground">{app.reason}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="success"
                      disabled={actionLoading}
                      onClick={() => handleApprove(app.id)}
                      className="gap-1.5 text-xs font-semibold"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Approve & Execute Rollback
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={actionLoading}
                      onClick={() => handleReject(app.id)}
                      className="gap-1.5 text-xs text-muted-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                      Reject Action
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6 Tabs Navigation Bar (PRD Section 18) */}
        <div className="flex border-t border-border bg-secondary/30 px-4 overflow-x-auto">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'evidence', label: `Evidence (${incident.evidence?.length || 0})` },
            { key: 'investigation', label: 'Investigation' },
            { key: 'trace', label: `Agent Trace (${steps.length})` },
            { key: 'remediation', label: 'Remediation' },
            { key: 'timeline', label: 'Timeline' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-3 text-xs font-mono font-medium whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                  : 'border-transparent text-muted-foreground hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Tab 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-card/40">
              <CardHeader className="p-4 border-b border-border">
                <CardTitle className="text-xs font-mono uppercase text-muted-foreground">
                  Incident Synthesis & Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs leading-relaxed">
                <p className="text-white">
                  At 10:15 UTC, checkout deployment <code className="font-mono text-blue-400 bg-secondary px-1 py-0.5 rounded">v2.14.0</code> was released to production. At 10:18 UTC, checkout 5xx error rate spiked to 32% with connection timeout stack traces.
                </p>
                <div className="p-3 rounded-lg border border-border bg-secondary/30 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">Service Impact</span>
                    <div className="font-semibold text-white mt-0.5">checkout-service</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">Peak Error Rate</span>
                    <div className="font-semibold text-red-400 mt-0.5">31.8%</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">Queued Requests</span>
                    <div className="font-semibold text-amber-400 mt-0.5">412 waiting</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Evidence Highlight */}
            <Card className="bg-card/40">
              <CardHeader className="p-4 border-b border-border">
                <CardTitle className="text-xs font-mono uppercase text-muted-foreground">
                  Supporting Evidence Highlights
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2.5">
                {(incident.evidence || []).map((ev: any) => (
                  <div key={ev.id} className="p-3 rounded border border-border bg-secondary/20 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-mono uppercase">
                          {ev.sourceType}
                        </Badge>
                        <span className="text-xs font-semibold text-white">{ev.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">
                        {Math.round(ev.relevanceScore * 100)}% Match
                      </span>
                    </div>
                    <pre className="font-mono text-[11px] text-muted-foreground p-2 rounded bg-background/80 overflow-x-auto whitespace-pre-wrap border border-border/50">
                      {ev.excerpt}
                    </pre>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Run telemetry and models */}
          <div className="space-y-6">
            <Card className="bg-card/40">
              <CardHeader className="p-4 border-b border-border">
                <CardTitle className="text-xs font-mono uppercase text-muted-foreground">
                  AI Investigation Run Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 font-mono text-xs">
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Foundation Model</span>
                  <span className="text-blue-400">Gemini 3.8 Flash</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Orchestrator</span>
                  <span className="text-white">LangGraph.js</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Input Tokens</span>
                  <span className="text-white">{run?.inputTokens?.toLocaleString() || 14200}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Output Tokens</span>
                  <span className="text-white">{run?.outputTokens?.toLocaleString() || 3840}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Estimated Run Cost</span>
                  <span className="text-emerald-400 font-semibold">{formatCost(run?.estimatedCost || 0.0044)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: EVIDENCE VIEW (PRD Section 19) */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-border bg-secondary/30 text-xs">
            <span className="font-mono text-blue-400 uppercase tracking-wider text-[11px] block font-bold">
              Verification Matrix
            </span>
            <p className="text-muted-foreground mt-1">
              Every critical claim in Zeemo requires direct supporting evidence from logs, code diffs, deployments, or documented runbooks.
            </p>
          </div>

          <div className="space-y-3">
            {(incident.evidence || []).map((ev: any) => (
              <Card key={ev.id} className="bg-card/40 border-border">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Badge
                      variant={
                        ev.sourceType === 'log'
                          ? 'critical'
                          : ev.sourceType === 'code'
                          ? 'high'
                          : 'outline'
                      }
                    >
                      {ev.sourceType.toUpperCase()}
                    </Badge>
                    <span className="font-semibold text-white text-xs">{ev.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground">{ev.location}</span>
                    <Badge variant="success">{Math.round(ev.relevanceScore * 100)}% Verified</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <pre className="font-mono text-xs text-blue-200/90 bg-background/90 p-3 rounded-md border border-border overflow-x-auto whitespace-pre-wrap">
                    {ev.excerpt}
                  </pre>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span>Source ID: {ev.sourceId}</span>
                    <span>Captured: {formatTimestamp(ev.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: INVESTIGATION */}
      {activeTab === 'investigation' && (
        <div className="space-y-4">
          <Card className="bg-card/40">
            <CardHeader className="p-4 border-b border-border">
              <CardTitle className="text-xs font-mono uppercase text-muted-foreground">
                Hypothesis Verification Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    ✓ PRIMARY VERIFIED HYPOTHESIS (CONFIDENCE: 89%)
                  </span>
                  <Badge variant="success">CONFIRMED</Badge>
                </div>
                <p className="text-xs text-white leading-relaxed">
                  PostgreSQL connection leak in <code className="font-mono text-blue-300">src/handlers/promo.ts</code> caused pool acquisition timeouts after promo code validation was executed concurrently.
                </p>
                <div className="text-[11px] text-muted-foreground font-mono">
                  Supported by Knex timeout logs, git commit e4f89a1 AST inspection, and RUN-042 documentation.
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border bg-secondary/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground font-mono">
                    ✗ REJECTED HYPOTHESIS: Upstream Payment Gateway Outage
                  </span>
                  <Badge variant="outline">REJECTED</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Investigated whether third-party Stripe / Adyen gateways were throttling transactions. Health checks and network traces showed gateway responses at 45ms P95 with 0% error rate.
                </p>
                <div className="text-[11px] text-muted-foreground font-mono">
                  Reason: Contradicted by payment partner ping latencies and zero upstream 5xx responses.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 4: AGENT TRACE (PRD Section 20 & 41) */}
      {activeTab === 'trace' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/40">
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-muted-foreground">Agent Steps:</span>
              <span className="text-white font-bold">{steps.length}</span>
              <span className="text-muted-foreground ml-3">Tool Invocations:</span>
              <span className="text-white font-bold">{toolCalls.length}</span>
            </div>
            <Badge variant="outline" className="font-mono text-[10px]">
              DETERMINISTIC LANGGRAPH TRACE
            </Badge>
          </div>

          <div className="space-y-4">
            {steps.map((step: any, idx: number) => (
              <div key={step.id} className="relative pl-6 border-l-2 border-blue-500/40 space-y-2">
                <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-mono font-bold text-white">
                  {idx + 1}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[10px] uppercase">
                      {step.agentName} agent
                    </Badge>
                    <span className="text-xs font-semibold text-white">{step.title}</span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {step.latencyMs}ms • {formatTimestamp(step.createdAt)}
                  </span>
                </div>

                <div className="p-3 rounded-md border border-border bg-card/40 space-y-2 text-xs font-mono">
                  {step.input && (
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase">Agent Input:</span>
                      <pre className="text-muted-foreground text-[11px] mt-0.5 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(step.input, null, 2)}
                      </pre>
                    </div>
                  )}
                  {step.output && (
                    <div className="pt-2 border-t border-border/60">
                      <span className="text-[10px] text-blue-400 uppercase">Agent Synthesis:</span>
                      <pre className="text-blue-200 text-[11px] mt-0.5 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(step.output, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Tool Invocations Section */}
          <div className="pt-4 border-t border-border space-y-3">
            <h3 className="text-xs font-mono uppercase text-muted-foreground">
              Tool Invocations & Permissions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {toolCalls.map((tool: any) => (
                <div key={tool.id} className="p-3 rounded-lg border border-border bg-card/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono">
                      <Terminal className="h-3.5 w-3.5 text-blue-400" />
                      <span className="text-white font-semibold">{tool.toolName}</span>
                    </div>
                    <Badge
                      variant={
                        tool.riskLevel === 'HIGH' || tool.riskLevel === 'CRITICAL'
                          ? 'critical'
                          : 'outline'
                      }
                    >
                      {tool.riskLevel}
                    </Badge>
                  </div>
                  <pre className="font-mono text-[10px] text-muted-foreground bg-background p-2 rounded overflow-x-auto">
                    args: {JSON.stringify(tool.arguments)}
                  </pre>
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                    <span>Status: {tool.status}</span>
                    <span>{tool.latencyMs}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: REMEDIATION (PRD Section 32 & 34) */}
      {activeTab === 'remediation' && (
        <div className="space-y-4">
          <Card className="bg-card/40">
            <CardHeader className="p-4 border-b border-border">
              <CardTitle className="text-xs font-mono uppercase text-muted-foreground">
                Remediation Plan & Safe Action Gates
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {[
                {
                  step: 1,
                  action: 'Roll back deployment v2.14.0 to v2.13.9',
                  risk: 'HIGH',
                  desc: 'Reverts commit e4f89a1 to restore stable database connection pool recycling.',
                  requiresApproval: true,
                  status: incident.status === 'resolved' ? 'EXECUTED & VERIFIED' : 'AWAITING APPROVAL',
                },
                {
                  step: 2,
                  action: 'Add transaction scope linter rule to CI',
                  risk: 'LOW',
                  desc: 'Enforce automatic static analysis check for unreleased Knex/pg connections in route handlers.',
                  requiresApproval: false,
                  status: 'RECOMMENDED',
                },
                {
                  step: 3,
                  action: 'Add pool acquisition timeout alert',
                  risk: 'LOW',
                  desc: 'Trigger PagerDuty warning when connection queue depth exceeds 20 requests for > 60s.',
                  requiresApproval: false,
                  status: 'RECOMMENDED',
                },
              ].map((item) => (
                <div key={item.step} className="p-4 rounded-lg border border-border bg-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-xs">#{item.step}</span>
                      <span className="font-semibold text-white text-xs">{item.action}</span>
                      <Badge variant={item.risk === 'HIGH' ? 'high' : 'low'}>
                        {item.risk} RISK
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Badge variant={item.status.includes('VERIFIED') ? 'success' : 'outline'} className="self-start sm:self-auto">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 6: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <Card className="bg-card/40">
            <CardHeader className="p-4 border-b border-border">
              <CardTitle className="text-xs font-mono uppercase text-muted-foreground">
                Chronological Incident Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {[
                { time: '10:15:00 UTC', title: 'Deployment v2.14.0 promoted to production' },
                { time: '10:18:22 UTC', title: 'Checkout 5xx error rate spiked to 31.8%' },
                { time: '10:20:00 UTC', title: 'Incident INC-111111 created by SRE Alex Rivera' },
                { time: '10:21:00 UTC', title: 'Zeemo Orchestrator started investigation run' },
                { time: '10:21:05 UTC', title: 'Log Agent isolated Knex pool exhaustion' },
                { time: '10:21:08 UTC', title: 'Code Agent flagged promo.ts unreleased client' },
                { time: '10:21:13 UTC', title: 'Verifier Agent confirmed hypothesis (89% confidence)' },
                { time: '10:21:15 UTC', title: 'High-risk rollback action paused for human approval' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 text-xs font-mono">
                  <span className="text-muted-foreground w-28 shrink-0">{item.time}</span>
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                  <span className="text-white">{item.title}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
