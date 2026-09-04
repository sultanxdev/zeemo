'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import {
  CheckmarkCircle02Icon,
  RefreshIcon,
  ShieldSecurityIcon,
} from '@hugeicons/core-free-icons';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-24 relative overflow-hidden font-geist-mono border-t border-black/[0.06] dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <Badge variant="outline" className="mb-3.5 px-3.5 py-1 text-xs text-zinc-600 dark:text-zinc-400 bg-white/90 dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 shadow-xs font-mono">
            How It Works
          </Badge>
          <h2
            className="text-3xl sm:text-5xl font-normal tracking-tight text-zinc-950 dark:text-white leading-[1.12]"
            style={{ fontFamily: "var(--font-serif, 'Newsreader', Georgia, serif)" }}
          >
            Investigate once.{' '}
            <span className="italic text-zinc-800 dark:text-zinc-200">
              Zeemo handles the rest.
            </span>
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
            Your system reports an incident alert. Zeemo coordinates specialized agents across code, logs, and runbooks to deliver verified root causes and safe remediation.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="space-y-6">
          {/* Top Flow Card: Visual Diagram */}
          <div className="rounded-[22px] border border-black/[0.08] dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            {/* Visual Node Flow */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Node 1: Alert / Telemetry */}
              <div className="rounded-xl border border-blue-200/80 dark:border-blue-900/40 bg-[#F0F7FF] dark:bg-blue-950/20 p-4 text-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold block mb-1">
                  Trigger
                </span>
                <span className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-white block">
                  Incident Alert
                </span>
                <span className="text-xs text-zinc-500 font-mono mt-1 block">
                  5xx Surge / Latency
                </span>
              </div>

              {/* Node 2: Zeemo Orchestrator */}
              <div className="rounded-xl border border-zinc-900 dark:border-white/20 bg-zinc-950 p-4 text-center text-white shadow-sm">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold block mb-1">
                  Engine
                </span>
                <span className="font-bold text-sm sm:text-base block">
                  Zeemo Orchestrator
                </span>
                <span className="text-xs text-zinc-400 font-mono mt-1 block">
                  LangGraph.js State
                </span>
              </div>

              {/* Node 3: Specialist Agents */}
              <div className="rounded-xl border border-amber-200/80 dark:border-amber-900/40 bg-[#FFF7ED] dark:bg-amber-950/20 p-4 text-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold block mb-1">
                  Specialists
                </span>
                <span className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-white block">
                  Code, Logs &amp; RAG
                </span>
                <span className="text-xs text-zinc-500 font-mono mt-1 block">
                  Correlate Evidence
                </span>
              </div>

              {/* Node 4: Dual Outcomes (Verified Diagnosis / Approval Gate) */}
              <div className="space-y-2">
                {/* Verified Outcome */}
                <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-[#F0FDF4] dark:bg-emerald-950/20 px-3.5 py-2 flex items-center justify-between text-xs font-mono text-emerald-800 dark:text-emerald-300">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Icon icon={CheckmarkCircle02Icon} size={14} className="text-emerald-600 dark:text-emerald-400" />
                    Diagnosis
                  </span>
                  <span className="text-[11px] font-medium bg-emerald-100/80 dark:bg-emerald-900/50 px-2 py-0.5 rounded text-emerald-700 dark:text-emerald-300">
                    89% Confidence
                  </span>
                </div>

                {/* Approval Gate Outcome */}
                <div className="rounded-lg border border-purple-200 dark:border-purple-900/40 bg-[#FAF5FF] dark:bg-purple-950/20 px-3.5 py-2 flex items-center justify-between text-xs font-mono text-purple-800 dark:text-purple-300">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Icon icon={RefreshIcon} size={14} className="text-purple-600 dark:text-purple-400" />
                    Rollback
                  </span>
                  <span className="text-[11px] font-medium bg-purple-100/80 dark:bg-purple-900/50 px-2 py-0.5 rounded text-purple-700 dark:text-purple-300">
                    Approval Gate
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bento 3-Grid: STEP 01, STEP 02, STEP 03 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* STEP 01 */}
            <div className="rounded-[22px] border border-[#D9EAFD] dark:border-blue-900/30 bg-[#F0F7FF] dark:bg-blue-950/10 p-6 sm:p-7 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-mono text-xs font-bold text-zinc-400">
                    STEP 01
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                    01 Ingest
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white leading-snug">
                  Create an incident
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                  Describe symptoms or feed webhook telemetry. Zeemo stores the context and queues the investigation plan immediately.
                </p>
              </div>

              {/* Small UI */}
              <div className="mt-6 rounded-xl border border-black/[0.08] dark:border-white/10 bg-white dark:bg-zinc-900 p-3.5 font-mono text-xs shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 dark:text-white">POST /v1/incidents</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800 text-[11px]">
                    202 Queued
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 pt-1 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-amber-500" />
                  <span>RabbitMQ topic: zeemo.investigations</span>
                </div>
              </div>
            </div>

            {/* STEP 02 */}
            <div className="rounded-[22px] border border-[#FED7AA]/60 dark:border-amber-900/30 bg-[#FFF7ED] dark:bg-amber-950/10 p-6 sm:p-7 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-mono text-xs font-bold text-zinc-400">
                    STEP 02
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800">
                    02 Investigate
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white leading-snug">
                  Specialists correlate
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                  Log Agent detects error patterns, Code Agent scans git diffs, and Knowledge Agent retrieves runbooks via pgvector.
                </p>
              </div>

              {/* Small UI */}
              <div className="mt-6 rounded-xl border border-black/[0.08] dark:border-white/10 bg-white dark:bg-zinc-900 p-3.5 font-mono text-xs shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-medium text-[11px]">
                  <Icon icon={CheckmarkCircle02Icon} size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Logs Analyzed (Knex timeout)</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-medium text-[11px]">
                  <Icon icon={CheckmarkCircle02Icon} size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Git Diff Inspected (promo.ts)</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-medium text-[11px]">
                  <Icon icon={CheckmarkCircle02Icon} size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Runbook Matched (RUN-042)</span>
                </div>
              </div>
            </div>

            {/* STEP 03 */}
            <div className="rounded-[22px] border border-[#BBF7D0] dark:border-emerald-900/30 bg-[#F0FDF4] dark:bg-emerald-950/10 p-6 sm:p-7 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-mono text-xs font-bold text-zinc-400">
                    STEP 03
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                    03 Remediate
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white leading-snug">
                  Safe recovery verification
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                  High-risk actions require human sign-off. Once authorized, Zeemo verifies healthy recovery and marks the incident resolved.
                </p>
              </div>

              {/* Small UI */}
              <div className="mt-6 rounded-xl border border-black/[0.08] dark:border-white/10 bg-white dark:bg-zinc-900 p-3.5 font-mono text-xs shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-800 dark:text-zinc-200 font-semibold text-[11.5px]">Human Approval</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800 text-[11px]">
                    → Authorized
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-800 dark:text-zinc-200 font-semibold text-[11.5px]">ECS Rollback v2.13.9</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800 text-[11px]">
                    ✓ 200 OK Normal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
