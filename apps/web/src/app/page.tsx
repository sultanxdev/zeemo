import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Cpu,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileSearch,
  Terminal,
  Layers,
  Database,
  GitPullRequest,
  Activity,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-blue-600/30 selection:text-blue-200">
      {/* Public Navbar */}
      <nav className="border-b border-border/80 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Cpu className="h-5 w-5" />
              </div>
              <span className="font-bold tracking-wider text-base text-white font-mono">ZEEMO</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#product" className="hover:text-white transition-colors">Product</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
              <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
              <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="text-xs font-mono">
                View Live App
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="text-xs font-medium">
                Get Started
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center flex flex-col items-center">
        {/* Subtle grid background */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono mb-8">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Multi-Agent Incident SRE Platform</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.15]">
          Investigate production incidents with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">
            evidence-backed AI.
          </span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Zeemo investigates your code, logs, deployments, and engineering knowledge to identify likely root causes and show the verifiable evidence behind every conclusion.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="h-11 px-6 text-sm font-semibold shadow-lg shadow-blue-500/25">
              Start investigating
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/incidents/11111111-1111-1111-1111-111111111111">
            <Button variant="outline" size="lg" className="h-11 px-6 text-sm font-mono border-border hover:bg-secondary">
              View Demo Incident
            </Button>
          </Link>
        </div>

        {/* Hero Interactive Terminal / Incident Preview Card */}
        <div className="mt-16 w-full max-w-5xl rounded-xl border border-border bg-card/70 backdrop-blur-xl shadow-2xl text-left overflow-hidden">
          <div className="h-10 bg-secondary/50 border-b border-border px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-muted-foreground">INC-104: Checkout API 5xx spike</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="critical">CRITICAL</Badge>
              <Badge variant="high">89% CONFIDENCE</Badge>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-muted-foreground tracking-wider">Root Cause Diagnosis</span>
                <p className="mt-1 text-sm font-medium text-white leading-relaxed">
                  Database connection pool exhaustion caused by unclosed transaction connections in the new promo code validation handler introduced in commit <code className="text-blue-400 font-mono bg-secondary px-1 py-0.5 rounded">e4f89a1</code>.
                </p>
              </div>

              <div className="pt-2">
                <span className="text-[11px] font-mono uppercase text-muted-foreground tracking-wider">Correlated Evidence (4 Sources)</span>
                <div className="mt-2 space-y-2">
                  <div className="p-2.5 rounded border border-border bg-secondary/30 flex items-start gap-3 text-xs">
                    <span className="text-emerald-400 font-mono font-bold">✓</span>
                    <div>
                      <span className="font-mono text-white">checkout-service logs:</span>
                      <span className="text-muted-foreground ml-1">Knex: Timeout acquiring connection (50/50 max connections)</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded border border-border bg-secondary/30 flex items-start gap-3 text-xs">
                    <span className="text-emerald-400 font-mono font-bold">✓</span>
                    <div>
                      <span className="font-mono text-white">git diff e4f89a1:</span>
                      <span className="text-muted-foreground ml-1">src/handlers/promo.ts: client.release() missed in early return</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l border-border pl-6 space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase text-muted-foreground tracking-wider">Recommended Action</span>
                <div className="mt-2 p-3 rounded-lg border border-amber-500/40 bg-amber-950/20 text-xs">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Rollback deployment v2.14.0</span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    Requires human approval to execute production rollback.
                  </p>
                </div>
              </div>

              <Link href="/incidents/11111111-1111-1111-1111-111111111111">
                <Button size="sm" className="w-full text-xs font-mono">
                  Inspect Full Investigation Trace →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Problem Statement */}
      <section id="product" className="py-20 border-t border-border bg-card/20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Badge variant="outline" className="font-mono text-xs mb-4">
            THE FRAGMENTED INVESTIGATION PROBLEM
          </Badge>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Production incidents shouldn&apos;t require 20 browser tabs.
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-sm">
            Engineers waste hours toggling between observability dashboards, Git repositories, deployment pipelines, runbook wikis, and postmortems.
          </p>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { title: 'GitHub Commits', icon: GitPullRequest },
              { title: 'Telemetry Logs', icon: Activity },
              { title: 'ECS Deployments', icon: Layers },
              { title: 'Runbooks & Wiki', icon: FileSearch },
              { title: 'Database Metrics', icon: Database },
              { title: 'Past Postmortems', icon: Terminal },
            ].map((source) => {
              const Icon = source.icon;
              return (
                <div key={source.title} className="p-4 rounded-lg border border-border bg-card/60 flex flex-col items-center gap-2.5 text-center">
                  <Icon className="h-5 w-5 text-blue-400" />
                  <span className="text-xs font-medium text-white">{source.title}</span>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-sm font-mono text-blue-400">
            Zeemo connects the investigation into a single evidence-backed workflow.
          </p>
        </div>
      </section>

      {/* Section 2: How It Works */}
      <section id="how-it-works" className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="font-mono text-xs mb-3">WORKFLOW</Badge>
            <h2 className="text-3xl font-bold text-white tracking-tight">How Zeemo Investigates</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Create Incident', desc: 'Describe symptoms or trigger automated alert webhook.' },
              { step: '02', title: 'Zeemo Investigates', desc: 'Orchestrator deploys log, code, and knowledge specialists.' },
              { step: '03', title: 'Review Evidence', desc: 'Inspect verified hypotheses with source citations.' },
              { step: '04', title: 'Approve Risky Actions', desc: 'Human-in-the-loop gate ensures safe remediation.' },
              { step: '05', title: 'Verify Recovery', desc: 'Platform monitors metrics to confirm healthy recovery.' },
            ].map((item) => (
              <div key={item.step} className="p-5 rounded-lg border border-border bg-card/40 flex flex-col justify-between space-y-4">
                <span className="text-2xl font-mono font-bold text-blue-500/80">{item.step}</span>
                <div>
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Core Capabilities */}
      <section id="capabilities" className="py-20 border-t border-border bg-card/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="font-mono text-xs mb-3">ENGINEERING ARCHITECTURE</Badge>
            <h2 className="text-3xl font-bold text-white tracking-tight">Core Platform Capabilities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-border bg-card/60 space-y-3">
              <div className="h-9 w-9 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Multi-Agent Orchestration</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Powered by LangGraph.js. Specialist agents for logs, code diffs, and engineering runbooks operate in concert under a central orchestrator. A dedicated Verifier Agent challenges assumptions before any conclusion is finalized.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card/60 space-y-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Evidence-Backed Diagnosis</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Never hallucinate without proof. Every root cause claim points directly to supporting evidence excerpts, commit hashes, specific source lines, and log timestamp occurrences.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card/60 space-y-3">
              <div className="h-9 w-9 rounded-lg bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Hybrid RAG Knowledge Engine</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                PostgreSQL + pgvector with semantic chunking and hybrid BM25 + dense vector cosine retrieval with metadata filtering across runbooks, architecture specs, and previous postmortems.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card/60 space-y-3">
              <div className="h-9 w-9 rounded-lg bg-amber-600/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Human Approval Gates</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Strict risk classification engine. Sensitive actions (rollbacks, restarts, config mutations) require explicit human authorization, preventing unintended automated disasters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-auto py-8 px-6 bg-card/60 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono">
            <Cpu className="h-4 w-4 text-blue-400" />
            <span className="font-semibold text-white">ZEEMO</span>
            <span>— AI Engineering Incident Investigation Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-white transition-colors">Workspace</Link>
            <Link href="/evaluations" className="hover:text-white transition-colors">Evaluations</Link>
            <Link href="/incidents" className="hover:text-white transition-colors">Incidents</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
