import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { GithubIcon } from '@hugeicons/core-free-icons';

const productLinks = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Product', href: '#product' },
  { label: 'AI Evaluations', href: '/evaluations' },
  { label: 'Demo Incident', href: '/incidents/11111111-1111-1111-1111-111111111111' },
];

const developerLinks = [
  { label: 'LangGraph Multi-Agent', href: '/incidents' },
  { label: 'PostgreSQL + pgvector RAG', href: '/knowledge' },
  {
    label: 'GitHub Repository',
    href: 'https://github.com/sultanxdev/zeemo',
    external: true,
  },
];

const companyLinks = [
  { label: 'Live Dashboard', href: '/dashboard' },
  { label: 'Human Approvals', href: '/approvals' },
  { label: 'Audit Trail', href: '/audit' },
];

export function PublicFooter() {
  return (
    <footer className="overflow-hidden border-t border-black/[0.06] dark:border-white/10 bg-zinc-100/70 dark:bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1040px] px-4 pt-14 sm:px-6 sm:pt-16">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-8">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center overflow-hidden rounded-xl bg-black border border-white/10 shadow-xs transition-transform duration-200 group-hover:scale-105">
                <img
                  src="/logo.png"
                  alt="Zeemo"
                  className="size-full rounded-lg object-cover"
                />
              </div>

              <span className="text-xl font-bold lowercase tracking-tight text-zinc-900 dark:text-white font-mono">
                zeemo
              </span>

              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-amber-600 dark:text-amber-400">
                v1.0
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              AI engineering platform that investigates software incidents across code, logs, deployments, and runbooks with verifiable evidence and human approval gates.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-900 dark:text-white">
              Product
            </h3>

            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-200 hover:text-zinc-900 dark:hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-900 dark:text-white">
              Developers
            </h3>

            <ul className="mt-4 space-y-3">
              {developerLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-200 hover:text-zinc-900 dark:hover:text-white"
                    >
                      {link.label}
                      <Icon icon={GithubIcon} size={14} />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-200 hover:text-zinc-900 dark:hover:text-white"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-900 dark:text-white">
              Platform
            </h3>

            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-200 hover:text-zinc-900 dark:hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-black/[0.06] dark:border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] text-zinc-400">
            <div className="inline-flex items-center gap-2">
              <div className="flex size-4 items-center justify-center overflow-hidden rounded-sm bg-black border border-white/10">
                <img
                  src="/logo.png"
                  alt="Zeemo"
                  className="size-full object-cover"
                />
              </div>
              <span>
                &copy; {new Date().getFullYear()} Zeemo Inc.
              </span>
            </div>

            <span className="text-zinc-300 dark:text-zinc-700">&middot;</span>

            <Link
              href="/dashboard"
              className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Terms &amp; Security
            </Link>

            <Link
              href="/evaluations"
              className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Benchmark Evals
            </Link>
          </div>

          {/* Built by sultanxdev */}
          <a
            href="https://sultanx.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 transition-colors duration-200 hover:text-zinc-900 dark:hover:text-white"
          >
            <span>Built by</span>

            <span className="font-semibold text-zinc-600 dark:text-zinc-300 transition-colors group-hover:text-amber-500">
              sultanxdev
            </span>

            <span className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              ↗
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
