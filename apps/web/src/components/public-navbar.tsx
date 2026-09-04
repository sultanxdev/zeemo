'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  GithubIcon,
  Menu01Icon,
  Cancel01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center px-3 pt-3 sm:px-8 sm:pt-6 pointer-events-none">
      <nav className="pointer-events-auto flex w-full max-w-[1200px] items-center justify-between gap-3 rounded-full border border-black/[0.08] dark:border-white/10 bg-white/85 dark:bg-zinc-950/85 px-4 py-2.5 sm:px-5 sm:py-3 text-foreground shadow-[0_12px_36px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all">
        {/* Brand Logo & Version */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative size-7 sm:size-8 rounded-xl overflow-hidden shadow-xs group-hover:scale-105 transition-transform flex items-center justify-center bg-black border border-white/10">
              <img
                src="/logo.png"
                alt="Zeemo logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-foreground font-mono lowercase">zeemo</span>
              <span className="hidden sm:inline-flex items-center rounded-full bg-amber-500/10 dark:bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400 border border-amber-500/30 font-mono">
                v1.0
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-7 text-[13.5px] font-medium text-zinc-600 dark:text-zinc-400">
          <a href="#how-it-works" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
            How it works
          </a>
          <a href="#product" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
            Product
          </a>
          <Link href="/evaluations" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
            Evaluations
          </Link>
          <Link href="/dashboard" className="hover:text-zinc-950 dark:hover:text-white transition-colors font-medium text-zinc-900 dark:text-zinc-100">
            Live Workspace
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://github.com/sultanxdev/zeemo"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center size-8 rounded-full border border-black/[0.08] dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="View on GitHub"
          >
            <Icon icon={GithubIcon} size={15} />
          </a>

          <div className="flex items-center gap-1.5">
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Button
              size="sm"
              asChild
              className="rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-xs px-3.5 sm:px-4 py-1.5 h-8 shadow-xs font-medium"
            >
              <Link href="/dashboard" className="flex items-center gap-1.5">
                <span>Start Investigating</span>
                <Icon icon={ArrowRight01Icon} size={14} />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden size-8 items-center justify-center rounded-full border border-black/[0.08] dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100"
            aria-label="Toggle menu"
          >
            <Icon icon={mobileMenuOpen ? Cancel01Icon : Menu01Icon} size={16} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto mt-2 w-full max-w-[1200px] rounded-2xl border border-black/[0.08] dark:border-white/10 bg-white/95 dark:bg-zinc-950/95 p-4 shadow-xl backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              How it works
            </a>
            <a
              href="#product"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              Product
            </a>
            <Link
              href="/evaluations"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              AI Evaluations
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors font-medium text-zinc-950 dark:text-white"
            >
              Live Dashboard
            </Link>
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 px-2 py-1"
              >
                Sign In
              </Link>
              <a
                href="https://github.com/sultanxdev/zeemo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 px-2 py-1"
              >
                <Icon icon={GithubIcon} size={14} />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
