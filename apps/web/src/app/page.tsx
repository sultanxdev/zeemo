import React from 'react';
import Link from 'next/link';
import { PublicNavbar } from '@/components/public-navbar';
import { Hero } from '@/components/hero';
import { HowItWorks } from '@/components/how-it-works';
import { PublicFooter } from '@/components/public-footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Cpu,
  CheckCircle2,
  FileCode2,
  Terminal,
  Database,
  ShieldCheck,
  Activity,
  Layers,
  FileSearch,
  ArrowRight,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-background text-foreground flex flex-col selection:bg-amber-500/30 selection:text-amber-300">
      {/* Floating Pill Navbar */}
      <PublicNavbar />

      {/* Hero with Interactive Dashboard Preview */}
      <Hero />

      {/* How It Works with Visual Node Flow & Bento 3-Grid */}
      <HowItWorks />

      {/* Section: Problem Breakdown */}
      <section id="product" className="py-20 sm:py-24 border-t border-black/[0.06] dark:border-white/10 bg-white dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <Badge variant="outline" className="font-mono text-xs mb-4">
            FRAGMENTED INCIDENT TRIAGE
          </Badge>
          <h2
            className="text-3xl sm:text-5xl font-normal tracking-tight text-zinc-950 dark:text-white leading-[1.12]"
            style={{ fontFamily: "var(--font-serif, 'Newsreader', Georgia, serif)" }}
          >
            Production incidents shouldn&apos;t require{' '}
            <span className="italic text-zinc-800 dark:text-zinc-200">
              20 browser tabs.
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Engineers waste precious downtime switching between Datadog, GitHub commits, ECS deployment events, internal wiki runbooks, and past postmortems.
          </p>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
            {[
              { title: 'GitHub Commits', icon: FileCode2 },
              { title: 'Telemetry Logs', icon: Activity },
              { title: 'ECS Deployments', icon: Layers },
              { title: 'Runbooks & Wiki', icon: FileSearch },
              { title: 'Database Metrics', icon: Database },
              { title: 'Past Postmortems', icon: Terminal },
            ].map((source) => {
              const Icon = source.icon;
              return (
                <div
                  key={source.title}
                  className="p-4 rounded-xl border border-black/[0.08] dark:border-white/10 bg-zinc-50/80 dark:bg-zinc-900/60 flex flex-col items-center gap-2.5 text-center shadow-xs"
                >
                  <Icon className="size-5 text-amber-500" />
                  <span className="text-xs font-semibold text-zinc-900 dark:text-white">{source.title}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-10 p-6 rounded-2xl border border-black/[0.08] dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/40 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 block mb-1">
                ZEEMO CONNECTS THE INVESTIGATION
              </span>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">
                Multi-agent LangGraph orchestrator unifies logs, code, and runbooks into a single evidence-backed timeline.
              </p>
            </div>
            <Link href="/dashboard">
              <Button className="rounded-full text-xs font-mono font-medium shrink-0">
                Explore Workspace →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
