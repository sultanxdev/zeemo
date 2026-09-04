'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons';
import { HeroDashboardPreview } from '@/components/hero-dashboard-preview';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 md:pt-40 md:pb-20">
      {/* Subtle Glow Backdrop in warm amber & developer blue tones */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-amber-500/15 via-blue-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="flex flex-col items-center text-center gap-5 max-w-4xl mx-auto">
          {/* Version / Launch Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] dark:border-white/15 bg-white/90 dark:bg-zinc-900/90 px-3.5 py-1.5 text-xs font-medium text-zinc-800 dark:text-zinc-200 shadow-xs">
            <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold font-mono">zeemo v1.0</span>
            <span className="text-muted-foreground">•</span>
            <span>AI Engineering Incident Platform</span>
          </div>

          {/* Headline with mixed font hierarchy & serif accent */}
          <h1 className="font-geist-mono text-4xl sm:text-6xl lg:text-[70px] font-extrabold tracking-[-0.035em] text-zinc-950 dark:text-white leading-[1.05]">
            Incidents fail silently.{' '}
            <span
              className="font-normal text-zinc-800 dark:text-zinc-200 block sm:inline italic"
              style={{ fontFamily: "var(--font-serif, 'Newsreader', Georgia, serif)" }}
            >
              Your diagnosis shouldn&apos;t take hours.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed font-geist-mono">
            Zeemo investigates your code, logs, deployments, and engineering runbooks to produce an evidence-backed root-cause diagnosis and safe remediation plan.
          </p>

          {/* Dual Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Button size="lg" asChild className="rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-sm px-6 h-11 shadow-sm font-medium">
              <Link href="/dashboard" className="flex items-center gap-2">
                <span>Start investigating</span>
                <Icon icon={ArrowRight01Icon} size={16} />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="rounded-full border-black/[0.1] dark:border-white/15 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm px-6 h-11 font-medium shadow-xs">
              <Link href="/incidents/11111111-1111-1111-1111-111111111111" className="flex items-center gap-2">
                <span>View demo incident</span>
              </Link>
            </Button>
          </div>

          {/* 4 Feature Trust Checks */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-mono">
            <span className="flex items-center gap-1.5">
              <Icon icon={CheckmarkCircle02Icon} size={15} className="text-amber-500" />
              Evidence-backed diagnosis
            </span>
            <span className="flex items-center gap-1.5">
              <Icon icon={CheckmarkCircle02Icon} size={15} className="text-amber-500" />
              Git diff correlation
            </span>
            <span className="flex items-center gap-1.5">
              <Icon icon={CheckmarkCircle02Icon} size={15} className="text-amber-500" />
              Human approval gates
            </span>
            <span className="flex items-center gap-1.5">
              <Icon icon={CheckmarkCircle02Icon} size={15} className="text-amber-500" />
              Audit verification
            </span>
          </div>
        </div>

        {/* Hero Interactive Dashboard Visualizer */}
        <HeroDashboardPreview />
      </div>
    </section>
  );
}
