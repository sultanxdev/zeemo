'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Cpu,
  AlertTriangle,
  CheckCircle2,
  FileCode2,
  Terminal,
  FileText,
  ShieldAlert,
  ArrowRight,
  Check,
} from 'lucide-react';

export function HeroDashboardPreview() {
  const [activeTab, setActiveTab] = useState<'logs' | 'diff' | 'runbook' | 'remediation'>('logs');
  const [approved, setApproved] = useState(false);

  return (
    <div className="mt-12 sm:mt-16 w-full rounded-2xl border border-black/[0.08] dark:border-white/10 bg-white/95 dark:bg-zinc-950/90 shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-2xl overflow-hidden text-left font-sans">
      {/* Window Top Bar (Mac-style) */}
      <div className="h-11 bg-zinc-100/90 dark:bg-zinc-900/80 border-b border-black/[0.06] dark:border-white/10 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-red-500/80 inline-block" />
            <span className="size-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="size-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 pl-2 border-l border-zinc-200 dark:border-zinc-800">
            <div className="size-4 rounded overflow-hidden bg-black flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="logo" className="size-full object-cover" />
            </div>
            <span className="font-semibold text-zinc-900 dark:text-white">zeemo</span>
            <span>/</span>
            <span>incident-111111</span>
            <span>/</span>
            <span className="text-zinc-700 dark:text-zinc-300">checkout-service</span>
          </div>
        </div>

        {/* Live Orchestrator Pill */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-medium">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Orchestrator Active</span>
          </div>
          <Badge variant="critical" className="text-[10px] font-mono">
            CRITICAL
          </Badge>
        </div>
      </div>

      {/* Incident Header Strip */}
      <div className="p-4 sm:p-6 border-b border-black/[0.06] dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-red-500">INC-104</span>
            <span className="text-zinc-400">•</span>
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">production • checkout-service</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Checkout API 5xx spike after deployment v2.14.0
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Diagnosis: <strong className="text-zinc-800 dark:text-zinc-200">Database connection pool exhaustion</strong> (89% Confidence)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-right">
            <span className="text-[10px] font-mono text-zinc-500 block uppercase">Confidence</span>
            <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">89%</span>
          </div>
          <Link href="/incidents/11111111-1111-1111-1111-111111111111">
            <Button size="sm" className="rounded-lg text-xs font-mono h-9">
              Open Full Trace →
            </Button>
          </Link>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex border-b border-black/[0.06] dark:border-white/10 bg-zinc-100/50 dark:bg-zinc-900/20 px-4 sm:px-6 overflow-x-auto">
        {[
          { key: 'logs', label: 'Telemetry Logs', icon: Terminal },
          { key: 'diff', label: 'Git Diff (promo.ts)', icon: FileCode2 },
          { key: 'runbook', label: 'Runbook (RUN-042)', icon: FileText },
          { key: 'remediation', label: 'Approval Gate', icon: ShieldAlert },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs font-mono font-medium border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                  : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="p-4 sm:p-6 min-h-[220px] font-mono text-xs">
        {activeTab === 'logs' && (
          <div className="space-y-2 bg-zinc-950 text-zinc-300 p-4 rounded-xl border border-zinc-800">
            <div className="text-[11px] text-zinc-500 flex justify-between border-b border-zinc-800 pb-2">
              <span>SOURCE: log_stream_checkout_prod-pod-7f98d</span>
              <span className="text-red-400">5xx RATE: 31.8%</span>
            </div>
            <div className="space-y-1 text-[11px] pt-1 leading-relaxed">
              <p className="text-zinc-400">[10:18:22 UTC] INFO checkout-service route /v1/checkout/apply-promo received</p>
              <p className="text-red-400 font-bold">
                [10:18:24 UTC] ERROR Knex: Timeout acquiring a connection. The pool is probably full. Max connections reached: 50/50. Waiting clients: 312.
              </p>
              <p className="text-zinc-500">[10:18:25 UTC] WARN HTTP 504 Gateway Timeout returned to client req_98a7bc</p>
              <p className="text-emerald-400">✓ Log Agent correlated: Database connection starvation matching deployment window</p>
            </div>
          </div>
        )}

        {activeTab === 'diff' && (
          <div className="space-y-2 bg-zinc-950 text-zinc-300 p-4 rounded-xl border border-zinc-800">
            <div className="text-[11px] text-zinc-500 flex justify-between border-b border-zinc-800 pb-2">
              <span>COMMIT: e4f89a1 • src/handlers/promo.ts</span>
              <span className="text-amber-400">AUTHORS: checkout-team</span>
            </div>
            <pre className="text-[11px] leading-relaxed pt-1 overflow-x-auto whitespace-pre-wrap">
              <span className="text-zinc-500"> 48 | const client = await pool.connect();</span>{'\n'}
              <span className="text-zinc-500"> 49 | const promo = await validateCode(code);</span>{'\n'}
              <span className="text-red-400">- 50 | if (!promo.isValid) return res.status(400).json(&#123; error: &quot;Invalid code&quot; &#125;);</span>{'\n'}
              <span className="text-amber-300">
                // ⚠️ BUG: Early return never releases client back to pool! Pool dries up in seconds.
              </span>{'\n'}
              <span className="text-emerald-400">+ 51 | // FIX: Must call client.release() or wrap in try/finally</span>
            </pre>
          </div>
        )}

        {activeTab === 'runbook' && (
          <div className="space-y-2 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-800 dark:text-zinc-200 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <span className="font-bold text-zinc-900 dark:text-white">RUN-042: Database Pool Depletion &amp; Mitigation</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">94% Semantic Match</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 pt-1 leading-relaxed">
              &quot;When connection pool queue depth exceeds 50 requests concurrently with 5xx surges post-deployment, immediately inspect recent handler transactions for unreleased connections or execute rollback to previous release tag.&quot;
            </p>
            <div className="text-[11px] text-zinc-500 pt-2 font-mono">
              Retrieved by Hybrid RAG: Keyword BM25 + pgvector text-embedding-004
            </div>
          </div>
        )}

        {activeTab === 'remediation' && (
          <div className="space-y-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-500/30 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
                <ShieldAlert className="size-4" />
                <span>HUMAN APPROVAL REQUIRED FOR HIGH-RISK ACTION</span>
              </div>
              <Badge variant="high">HIGH RISK</Badge>
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-300">
              Recommended Action: Roll back deployment <code className="bg-black/10 dark:bg-black/50 px-1 py-0.5 rounded font-bold">v2.14.0</code> to last stable release <code className="bg-black/10 dark:bg-black/50 px-1 py-0.5 rounded font-bold">v2.13.9</code> on AWS ECS.
            </p>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500 font-mono">
                {approved ? '✓ Rollback executed: 12/12 containers healthy' : 'Awaiting human sign-off...'}
              </span>
              <Button
                size="sm"
                variant={approved ? 'success' : 'default'}
                onClick={() => setApproved(!approved)}
                className="gap-1.5 text-xs font-mono font-bold"
              >
                {approved ? (
                  <>
                    <Check className="size-3.5" />
                    <span>Recovery Verified (200 OK)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3.5" />
                    <span>Authorize Rollback</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
